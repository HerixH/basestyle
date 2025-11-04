"use client";
import styles from "./PostCard.module.css";
import SendUSDCButton from "./SendUSDCButton";
import MintNFTButton from "./MintNFTButton";
import ShareButton from "./ShareButton";
import { useEffect, useState } from "react";
import { createClient } from "../lib/supabase";
import { useName } from "@coinbase/onchainkit/identity";
import { useNotifications } from "../contexts/NotificationContext";

interface Post {
  id: string;
  wallet_address?: string | null;
  user_name: string;
  activity: string;
  category: string;
  image?: string;
  timestamp: number;
  nft_count: number;
  usdc_earned: number;
}

const CATEGORY_LABELS: Record<string, { label: string }> = {
  fitness: { label: 'Fitness' },
  learning: { label: 'Learning' },
  creativity: { label: 'Creativity' },
  health: { label: 'Health' },
  social: { label: 'Social' },
  work: { label: 'Work' },
  other: { label: 'Other' },
};

interface PostCardProps {
  post: Post;
  onSendNFT: (postId: string) => void;
  onSendUSDC: (postId: string, amount: number, txHash: string) => void;
  currentWalletAddress?: string;
  onEdit?: (post: Post) => void;
  onDelete?: (postId: string) => void;
  appUrl?: string;
}

// Displays a name, preferring Base name if the wallet has one
function CommentAuthorName({ wallet, fallback }: { wallet?: string | null; fallback: string }) {
  const hasWallet = !!wallet && wallet.startsWith('0x') && wallet.length === 42;
  const { data: baseName } = useName({ address: hasWallet ? (wallet as `0x${string}`) : undefined });
  const display = baseName || (hasWallet ? `${wallet!.slice(0,6)}...${wallet!.slice(-4)}` : fallback || 'Anonymous');
  return <>{display}</>;
}

export default function PostCard({ 
  post, 
  onSendNFT, 
  onSendUSDC,
  currentWalletAddress,
  onEdit,
  onDelete,
  appUrl = window.location.origin
}: PostCardProps) {
  // Check if this is the current user's post
  const isOwnPost = currentWalletAddress && post.wallet_address && post.wallet_address.toLowerCase() === currentWalletAddress.toLowerCase();
  const supabase = createClient();
  const { addNotification } = useNotifications();

  // Likes state
  const [likeCount, setLikeCount] = useState<number>(0);
  const [likedByMe, setLikedByMe] = useState<boolean>(false);

  // Comments state
  const [comments, setComments] = useState<Array<{ id: string; user_name: string | null; wallet_address: string | null; content: string; timestamp: number }>>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [subscribing, setSubscribing] = useState<boolean>(false);
  const [commentsCollapsed, setCommentsCollapsed] = useState<boolean>(true);

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const formatUSDC = (cents: number) => {
    return (cents / 100).toFixed(2);
  };

  const handleNFTSuccess = async (tokenId: string, txHash: string) => {
    console.log('NFT minted:', { tokenId, txHash });
    onSendNFT(post.id);
    // Immediate UI notification
    addNotification({
      type: 'nft',
      title: 'NFT Minted!',
      message: `You minted an NFT for ${postDisplayName}'s activity`,
      data: { postId: post.id, tokenId, txHash }
    });
  };

  const handleUSDCSuccess = (amount: number, txHash: string) => {
    // Convert dollar amount to cents for storage
    const cents = Math.round(amount * 100);
    onSendUSDC(post.id, cents, txHash);
    // Immediate UI notification
    addNotification({
      type: 'usdc',
      title: 'USDC Sent',
      message: `You sent $${amount.toFixed(2)} USDC to ${postDisplayName}`,
      data: { postId: post.id, amount: cents, txHash }
    });
  };

  // Use the post owner's wallet address (may be null for old posts)
  const recipientWallet = post.wallet_address || null;

  const categoryInfo = CATEGORY_LABELS[post.category] || CATEGORY_LABELS.other;

  // Resolve Base name for post author if wallet present
  const { data: postBaseName } = useName({ address: (post.wallet_address as `0x${string}`) || undefined });
  const postDisplayName = postBaseName || post.user_name;

  // Load likes and comments
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      // Likes count
      const { count } = await supabase
        .from('post_likes')
        .select('id', { count: 'exact', head: true })
        .eq('post_id', post.id);

      if (mounted) setLikeCount(count || 0);

      // My like
      if (currentWalletAddress) {
        const { data: myLike } = await supabase
          .from('post_likes')
          .select('id')
          .eq('post_id', post.id)
          .eq('wallet_address', currentWalletAddress)
          .maybeSingle();
        if (mounted) setLikedByMe(!!myLike);
      } else {
        if (mounted) setLikedByMe(false);
      }

      // Comments list (latest 20)
      const { data: commentRows } = await supabase
        .from('comments')
        .select('id, user_name, wallet_address, content, timestamp')
        .eq('post_id', post.id)
        .order('timestamp', { ascending: false })
        .limit(20);
      if (mounted) setComments(commentRows || []);
    };

    load();

    // Realtime subscriptions (optional best-effort)
    if (!subscribing) {
      setSubscribing(true);
      const channel = supabase
        .channel(`post-${post.id}-engagement`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'post_likes', filter: `post_id=eq.${post.id}` }, () => {
          // refresh likes
          supabase
            .from('post_likes')
            .select('id', { count: 'exact', head: true })
            .eq('post_id', post.id)
            .then(({ count }) => setLikeCount(count || 0));
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'comments', filter: `post_id=eq.${post.id}` }, () => {
          supabase
            .from('comments')
            .select('id, user_name, wallet_address, content, timestamp')
            .eq('post_id', post.id)
            .order('timestamp', { ascending: false })
            .limit(20)
            .then(({ data }) => setComments(data || []));
        })
        .subscribe();

      return () => {
        mounted = false;
        supabase.removeChannel(channel);
      };
    }

    return () => { mounted = false; };
  }, [post.id, currentWalletAddress, supabase, subscribing]);

  const toggleLike = async () => {
    if (!currentWalletAddress) return;
    if (likedByMe) {
      await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', post.id)
        .eq('wallet_address', currentWalletAddress);
      setLikedByMe(false);
      setLikeCount((c) => Math.max(0, c - 1));
    } else {
      const { error } = await supabase
        .from('post_likes')
        .insert({ post_id: post.id, wallet_address: currentWalletAddress });
      if (!error) {
        setLikedByMe(true);
        setLikeCount((c) => c + 1);
      }
    }
  };

  const addComment = async () => {
    const content = newComment.trim();
    if (!content) return;
    const userName = post.user_name; // fallback: we don’t know commenter’s name centrally; best-effort
    const { data, error } = await supabase
      .from('comments')
      .insert({
        post_id: post.id,
        wallet_address: currentWalletAddress || null,
        user_name: currentWalletAddress ? (currentWalletAddress.slice(0, 6) + '...' + currentWalletAddress.slice(-4)) : userName,
        content,
        timestamp: Date.now()
      })
      .select('id, user_name, wallet_address, content, timestamp')
      .single();
    if (!error && data) {
      setComments((prev) => [data, ...prev].slice(0, 20));
      setNewComment("");
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.userInfo}>
          <div className={styles.avatarPlaceholder}>
            {postDisplayName.charAt(0).toUpperCase()}
          </div>
          <div className={styles.userDetails}>
            <span className={styles.userName}>{postDisplayName}</span>
            <span className={styles.timestamp}>{formatTimestamp(post.timestamp)}</span>
          </div>
        </div>
        <div className={styles.categoryBadge}>
          {categoryInfo.label}
        </div>
      </div>

      <div className={styles.content}>
        <p className={styles.activity}>{post.activity}</p>
        {post.image && (
          <div className={styles.postImage}>
            <img 
              src={post.image} 
              alt="Post content"
              onError={(e) => {
                console.error('Image failed to load:', post.image);
                e.currentTarget.style.display = 'none';
              }}
              onLoad={() => console.log('Image loaded successfully:', post.image)}
            />
          </div>
        )}
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>${formatUSDC(post.usdc_earned)}</span>
          <span className={styles.statLabel}>USDC earned</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{post.nft_count}</span>
          <span className={styles.statLabel}>{post.nft_count === 1 ? 'NFT' : 'NFTs'}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{likeCount}</span>
          <span className={styles.statLabel}>{likeCount === 1 ? 'Like' : 'Likes'}</span>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.leftActions}>
          <ShareButton post={post} appUrl={appUrl} currentWalletAddress={currentWalletAddress} />
        </div>
        
        <div className={styles.rightActions}>
          {!isOwnPost && (
            <div className={styles.actions}>
              {recipientWallet ? (
                <SendUSDCButton
                  postId={post.id}
                  recipientAddress={recipientWallet}
                recipientName={postDisplayName}
                  onSuccess={handleUSDCSuccess}
                />
              ) : (
                <div className={styles.noWalletHint}>
                  Creator hasn&apos;t signed in
                </div>
              )}
              
              {recipientWallet ? (
                <MintNFTButton
                  postId={post.id}
                  recipientAddress={recipientWallet}
                  recipientName={postDisplayName}
                  activity={post.activity}
                  category={post.category}
                  onSuccess={handleNFTSuccess}
                />
              ) : (
                <button className={styles.sendNftButton} disabled>
                  Mint NFT
                </button>
              )}
            </div>
          )}
          
          {((isOwnPost && onDelete) || (!post.wallet_address && onDelete)) && (
            <div className={styles.ownPostActions}>
              {isOwnPost && onEdit && (
                <button 
                  className={styles.editButton}
                  onClick={() => onEdit?.(post)}
                  title="Edit post"
                >
                  Edit
                </button>
              )}
              <button 
                className={!post.wallet_address ? styles.oldPostDeleteButton : styles.deleteButton}
                onClick={() => onDelete?.(post.id)}
                title={!post.wallet_address ? "Delete old post" : "Delete post"}
              >
                {!post.wallet_address ? "Delete Old Post" : "Delete"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Engagement: Like + Comments */}
      <div className={styles.engagementSection}>
        <div className={styles.likeRow}>
          <button 
            className={`${styles.likeButton} ${likedByMe ? styles.liked : ''}`}
            onClick={toggleLike}
            disabled={!currentWalletAddress}
            title={currentWalletAddress ? (likedByMe ? 'Unlike' : 'Like') : 'Connect wallet to like'}
          >
            {likedByMe ? '♥ Liked' : '♡ Like'}
          </button>
          <span className={styles.likeCount}>{likeCount}</span>
        </div>

        <div className={styles.comments}>
          <div className={styles.addCommentRow}>
            <input
              type="text"
              placeholder={currentWalletAddress ? "Add a comment..." : "Connect wallet to comment"}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className={styles.commentInput}
              disabled={!currentWalletAddress}
              maxLength={280}
            />
            <button className={styles.commentSend} onClick={addComment} disabled={!currentWalletAddress || newComment.trim().length === 0}>
              Send
            </button>
          </div>
          {comments.length > 0 && (
            <div className={styles.commentFoldSection}>
              <div className={styles.commentFoldHeader}>
                <button
                  className={styles.commentToggle}
                  onClick={() => setCommentsCollapsed((v) => !v)}
                  aria-expanded={!commentsCollapsed}
                >
                  {commentsCollapsed ? `Show comments (${comments.length})` : `Hide comments`}
                </button>
              </div>
              {!commentsCollapsed && (
                <ul className={styles.commentList}>
                  {(commentsCollapsed ? comments.slice(0, 2) : comments).map((c) => (
                    <li key={c.id} className={styles.commentItem}>
                      <span className={styles.commentAuthor}>
                        <CommentAuthorName wallet={c.wallet_address || undefined} fallback={c.user_name || ''} />:
                      </span>
                      <span className={styles.commentText}>{c.content}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

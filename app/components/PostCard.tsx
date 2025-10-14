"use client";
import styles from "./PostCard.module.css";
import SendUSDCButton from "./SendUSDCButton";
import MintNFTButton from "./MintNFTButton";

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
}

export default function PostCard({ 
  post, 
  onSendNFT, 
  onSendUSDC,
  currentWalletAddress
}: PostCardProps) {
  // Check if this is the current user's post
  const isOwnPost = currentWalletAddress && post.wallet_address && post.wallet_address.toLowerCase() === currentWalletAddress.toLowerCase();

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
  };

  const handleUSDCSuccess = (amount: number, txHash: string) => {
    // Convert dollar amount to cents for storage
    const cents = Math.round(amount * 100);
    onSendUSDC(post.id, cents, txHash);
  };

  // Use the post owner's wallet address (may be null for old posts)
  const recipientWallet = post.wallet_address || null;

  const categoryInfo = CATEGORY_LABELS[post.category] || CATEGORY_LABELS.other;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.userInfo}>
          <div className={styles.avatarPlaceholder}>
            {post.user_name.charAt(0).toUpperCase()}
          </div>
          <div className={styles.userDetails}>
            <span className={styles.userName}>{post.user_name}</span>
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
      </div>

      <div className={styles.footer}>
        {!isOwnPost && (
          <div className={styles.actions}>
            {recipientWallet ? (
              <SendUSDCButton
                postId={post.id}
                recipientAddress={recipientWallet}
                recipientName={post.user_name}
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
                recipientName={post.user_name}
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
        
        {isOwnPost && (
          <div className={styles.ownPostBadge}>
            Your post
          </div>
        )}
      </div>
    </div>
  );
}

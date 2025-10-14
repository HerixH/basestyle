"use client";
import { useState, useEffect } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { minikitConfig } from "../minikit.config";
import { createClient } from "./lib/supabase";
import { useAccount } from "wagmi";
import { useName } from "@coinbase/onchainkit/identity";
import styles from "./page.module.css";
import PostCard from "./components/PostCard";
import WalletConnect from "./components/WalletConnect";

export const dynamic = 'force-dynamic';

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

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'fitness', label: 'Fitness' },
  { id: 'learning', label: 'Learning' },
  { id: 'creativity', label: 'Creativity' },
  { id: 'health', label: 'Health' },
  { id: 'social', label: 'Social' },
  { id: 'work', label: 'Work' },
  { id: 'other', label: 'Other' },
];

export default function Home() {
  const { isFrameReady, setFrameReady } = useMiniKit();
  const [activity, setActivity] = useState("");
  const [error, setError] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [showPostForm, setShowPostForm] = useState(false);
  const { address, isConnected } = useAccount();
  const { data: baseName } = useName({ address: address as `0x${string}` });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPostCategory, setSelectedPostCategory] = useState("other");
  const supabase = createClient();

  // User display name from wallet
  const userName = baseName || (address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Anonymous');

  // Initialize the miniapp
  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);


  // Load posts from database
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error);
        // Check if it's a "table doesn't exist" error
        if (error.message.includes('does not exist') || error.code === 'PGRST204' || error.code === '42P01') {
          setDbError('database-setup');
        } else {
          setDbError(error.message);
        }
        setLoading(false);
        return;
      }

      if (data) {
        // Database posts already match our Post interface (wallet-based)
        setPosts(data as Post[]);
        setDbError(null);
      }
      setLoading(false);
    };

    fetchPosts();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('posts-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'posts' },
        () => {
          fetchPosts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  // Filter and search posts
  useEffect(() => {
    let filtered = [...posts];

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post => 
        post.activity.toLowerCase().includes(query) ||
        post.user_name.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query)
      );
    }

    setFilteredPosts(filtered);
  }, [posts, selectedCategory, searchQuery]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("Image must be less than 5MB");
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    if (!address) return null;
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${address}-${Date.now()}.${fileExt}`;
      const filePath = `posts/${fileName}`;

      console.log('Uploading image:', { fileName, filePath, fileSize: file.size });

      const { data, error } = await supabase.storage
        .from('post-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Error uploading image:', error);
        setError(`Upload failed: ${error.message}`);
        return null;
      }

      const { data: urlData } = supabase.storage
        .from('post-images')
        .getPublicUrl(filePath);

      console.log('Image uploaded successfully:', urlData.publicUrl);
      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Upload failed. Please try again.');
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isConnected || !address) {
      setError("Please sign in to post");
      return;
    }

    if (!activity.trim()) {
      setError("Please enter your activity");
      return;
    }

    if (activity.length > 280) {
      setError("Activity must be 280 characters or less");
      return;
    }

    let imageUrl: string | undefined = undefined;

    // Upload image if selected
    if (imageFile) {
      setUploading(true);
      imageUrl = (await uploadImage(imageFile)) || undefined;
      setUploading(false);
      
      // If upload failed, show error and don't post
      if (imageFile && !imageUrl) {
        setError("Failed to upload image. Please try again or post without an image.");
        return;
      }
    }

    // Save post to database
    const { data: newPost, error: postError } = await supabase
      .from('posts')
      .insert([
        {
          wallet_address: address,
          user_name: userName,
          activity: activity,
          category: selectedPostCategory,
          image: imageUrl,
          timestamp: Date.now(),
          nft_count: 0,
          usdc_earned: 0
        }
      ])
      .select()
      .single();

    if (postError) {
      console.error('Error creating post:', postError);
      setError('Failed to create post. Please try again.');
      return;
    }

    console.log("New post created:", newPost);
    console.log("Image URL:", imageUrl);

    // Reset form
    setActivity("");
    setImageFile(null);
    setImagePreview(null);
    setSelectedPostCategory("other");
    setShowPostForm(false);
    
    // Posts will update automatically via real-time subscription
  };

  const handleSendNFT = async (postId: string) => {
    if (!isConnected || !address) {
      alert("Please sign in first");
      return;
    }

    // Get current post
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    // Update NFT count in database
    const { error } = await supabase
      .from('posts')
      .update({ nft_count: post.nft_count + 1 })
      .eq('id', postId);

    if (error) {
      console.error('Error updating NFT count:', error);
      alert('Failed to mint NFT. Please try again.');
      return;
    }

    console.log(`NFT minted for post ${postId} by wallet ${address}`);
    // Posts will update automatically via real-time subscription
  };

  const handleSendUSDC = async (postId: string, amountCents: number, txHash: string) => {
    // Get current post
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    // Update USDC earned in database
    const { error } = await supabase
      .from('posts')
      .update({ usdc_earned: post.usdc_earned + amountCents })
      .eq('id', postId);

    if (error) {
      console.error('Error updating USDC earned:', error);
      alert('Failed to record USDC payment. Please try again.');
      return;
    }

    console.log(`USDC sent to post ${postId}: $${amountCents / 100}, tx: ${txHash}`);
    // Posts will update automatically via real-time subscription
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.logo}>{minikitConfig.miniapp.name}</h1>
          <div className={styles.headerActions}>
            <WalletConnect />
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {/* Post Button - Only show when wallet is connected */}
        {isConnected && !showPostForm && (
          <button 
            className={styles.createPostButton}
            onClick={() => setShowPostForm(true)}
          >
            Share Today&apos;s Activity
          </button>
        )}

        {/* Post Form */}
        {showPostForm && (
          <div className={styles.postFormCard}>
            <h2 className={styles.formTitle}>What did you do today?</h2>
            <form onSubmit={handleSubmit} className={styles.postForm}>
              <textarea
                placeholder="Share your daily activity... (e.g., Went to the gym, learned a new skill, helped someone)"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                className={styles.activityInput}
                rows={4}
                maxLength={280}
              />
              
              <div className={styles.charCount}>
                {activity.length}/280
              </div>

              {/* Category Selection */}
              <div className={styles.categorySelect}>
                <label className={styles.categoryLabel}>Category:</label>
                <select 
                  value={selectedPostCategory} 
                  onChange={(e) => setSelectedPostCategory(e.target.value)}
                  className={styles.categoryDropdown}
                >
                  {CATEGORIES.filter(cat => cat.id !== 'all').map(category => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Image Upload */}
              <div className={styles.imageUpload}>
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={styles.imageInput}
                />
                <label htmlFor="imageUpload" className={styles.imageLabel}>
                  <svg className={styles.uploadIcon} viewBox="0 0 24 24" fill="none">
                    <path
                      d="M21 15V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V15M17 8L12 3M12 3L7 8M12 3V15"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {imageFile ? imageFile.name : 'Add Image (Optional)'}
                </label>
              </div>

              {imagePreview && (
                <div className={styles.imagePreviewContainer}>
                  <img src={imagePreview} alt="Preview" className={styles.imagePreview} />
                  <button
                    type="button"
                    className={styles.removeImage}
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                  >
                    ✕
                  </button>
                </div>
              )}
              
              {error && <p className={styles.error}>{error}</p>}
              
              <div className={styles.formButtons}>
                <button 
                  type="button" 
                  className={styles.cancelButton}
                  onClick={() => {
                    setShowPostForm(false);
                    setActivity("");
                    setImageFile(null);
                    setImagePreview(null);
                    setSelectedPostCategory("other");
                    setError("");
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.submitButton} disabled={uploading}>
                  {uploading ? "Uploading..." : "Post Activity"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search and Filter */}
        <div className={styles.filterSection}>
          <div className={styles.searchContainer}>
            <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none">
              <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input
              type="text"
              placeholder="Search activities, users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            {searchQuery && (
              <button 
                className={styles.clearSearch}
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <div className={styles.categoryFilters}>
            {CATEGORIES.map(category => (
              <button
                key={category.id}
                className={`${styles.categoryButton} ${selectedCategory === category.id ? styles.categoryButtonActive : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Posts Feed */}
        <div className={styles.feed}>
          <h2 className={styles.feedTitle}>
            {searchQuery || selectedCategory !== 'all' 
              ? `Filtered Activities (${filteredPosts.length})` 
              : "Today's Activities"}
          </h2>
          <p className={styles.feedSubtitle}>
            Support great content with USDC on Base or mint NFTs
          </p>
          {filteredPosts.length === 0 ? (
            <div className={styles.emptyState}>
              <p>{posts.length === 0 ? 'No activities yet. Be the first to share!' : 'No activities match your search or filters.'}</p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onSendNFT={handleSendNFT}
                onSendUSDC={handleSendUSDC}
                currentWalletAddress={address}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}

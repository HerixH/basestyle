"use client";
import { useState } from "react";
import styles from "./ShareButton.module.css";

interface ShareButtonProps {
  post: {
    id: string;
    user_name: string;
    activity: string;
    category: string;
    image?: string;
    usdc_earned: number;
    nft_count: number;
    wallet_address?: string | null;
  };
  appUrl: string;
  currentWalletAddress?: string;
}

export default function ShareButton({ post, appUrl, currentWalletAddress }: ShareButtonProps) {
  const [showShareModal, setShowShareModal] = useState(false);

  // Check if this is the post owner's address
  const isOwnPost = currentWalletAddress && post.wallet_address && 
    post.wallet_address.toLowerCase() === currentWalletAddress.toLowerCase();

  // Generate different share text based on ownership
  const shareText = isOwnPost 
    ? `Just earned $${(post.usdc_earned / 100).toFixed(2)} USDC and ${post.nft_count} NFTs for my ${post.category} achievement: "${post.activity}"\n\n#Baselifestyle #Achievements #Base`
    : `Check out ${post.user_name}'s achievement! They earned $${(post.usdc_earned / 100).toFixed(2)} USDC and ${post.nft_count} NFTs for their ${post.category} activity: "${post.activity}"\n\n#Baselifestyle #Achievements #Base`;

  const shareUrls = {
    farcaster: `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}&embeds[]=${encodeURIComponent(appUrl)}`,
    zora: `https://zora.co/collect/base:${post.id}?text=${encodeURIComponent(shareText)}`,
    x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(appUrl)}`,
    copy: appUrl
  };

  const handleShare = async (platform: keyof typeof shareUrls) => {
    if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(shareUrls.copy);
        // You could add a toast notification here
        console.log('Link copied to clipboard');
      } catch (err) {
        console.error('Failed to copy link:', err);
      }
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
    setShowShareModal(false);
  };

  return (
    <>
      <button
        className={styles.shareButton}
        onClick={() => setShowShareModal(true)}
        title={isOwnPost ? "Share your achievement" : "Share this achievement"}
      >
        <svg className={styles.shareIcon} viewBox="0 0 24 24" fill="none">
          <path
            d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 5.12549 15.0077 5.24819 15.0227 5.36822L8.02274 8.36822C7.10419 7.52056 5.87519 7 4.5 7C2.01472 7 0 9.01472 0 11.5C0 13.9853 2.01472 16 4.5 16C5.87519 16 7.10419 15.4794 8.02274 14.6318L15.0227 17.6318C15.0077 17.7518 15 17.8745 15 18C15 19.6569 16.3431 21 18 21C19.6569 21 21 19.6569 21 18C21 16.3431 19.6569 15 18 15C16.6248 15 15.3958 15.5206 14.4773 16.3682L7.47726 13.3682C7.49234 13.2482 7.5 13.1255 7.5 13C7.5 12.8745 7.49234 12.7518 7.47726 12.6318L14.4773 9.63178C15.3958 10.4794 16.6248 11 18 11C19.6569 11 21 9.65685 21 8C21 6.34315 19.6569 5 18 5C16.3431 5 15 6.34315 15 8C15 8.12549 15.0077 8.24819 15.0227 8.36822L8.02274 11.3682C7.10419 10.5206 5.87519 10 4.5 10C2.01472 10 0 12.0147 0 14.5C0 16.9853 2.01472 19 4.5 19C5.87519 19 7.10419 18.4794 8.02274 17.6318L15.0227 20.6318C15.0077 20.7518 15 20.8745 15 21C15 22.6569 16.3431 24 18 24C19.6569 24 21 22.6569 21 21C21 19.3431 19.6569 18 18 18C16.6248 18 15.3958 18.5206 14.4773 19.3682L7.47726 16.3682C7.49234 16.2482 7.5 16.1255 7.5 16C7.5 15.8745 7.49234 15.7518 7.47726 15.6318L14.4773 12.6318C15.3958 13.4794 16.6248 14 18 14C19.6569 14 21 12.6569 21 11C21 9.34315 19.6569 8 18 8Z"
            fill="currentColor"
          />
        </svg>
        {isOwnPost ? 'Share Mine' : 'Share'}
      </button>

      {showShareModal && (
        <div className={styles.modalOverlay} onClick={() => setShowShareModal(false)}>
          <div className={styles.shareModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {isOwnPost ? 'Share Your Achievement' : 'Share This Achievement'}
              </h3>
              <button
                className={styles.closeButton}
                onClick={() => setShowShareModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className={styles.shareContent}>
              <div className={styles.postPreview}>
                <div className={styles.previewHeader}>
                  <span className={styles.categoryTag}>{post.category}</span>
                  <span className={styles.earnings}>
                    ${(post.usdc_earned / 100).toFixed(2)} USDC • {post.nft_count} NFTs
                  </span>
                </div>
                <p className={styles.previewText}>"{post.activity}"</p>
                <p className={`${styles.previewAuthor} ${isOwnPost ? styles.ownPost : styles.otherPost}`}>
                  {isOwnPost ? 'by you' : `by ${post.user_name}`}
                </p>
              </div>

              <div className={styles.shareOptions}>
                <button
                  className={styles.shareOption}
                  onClick={() => handleShare('farcaster')}
                >
                  <div className={styles.platformIcon}>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8.75 3h-1.5A1.25 1.25 0 0 0 6 4.25v15.5A1.25 1.25 0 0 0 7.25 21h1.5A1.25 1.25 0 0 0 10 19.75v-6.5h3v6.5A1.25 1.25 0 0 0 14.25 21h1.5A1.25 1.25 0 0 0 17 19.75v-6.5h1.75a1.25 1.25 0 0 0 1.25-1.25v-1.5a1.25 1.25 0 0 0-1.25-1.25H17v-4.5A1.25 1.25 0 0 0 15.75 3h-1.5A1.25 1.25 0 0 0 13 4.25v4.5h-3v-4.5A1.25 1.25 0 0 0 8.75 3z"/>
                    </svg>
                  </div>
                  <div className={styles.platformInfo}>
                    <span className={styles.platformName}>Farcaster</span>
                    <span className={styles.platformDesc}>Share to your Farcaster feed</span>
                  </div>
                </button>

                <button
                  className={styles.shareOption}
                  onClick={() => handleShare('zora')}
                >
                  <div className={styles.platformIcon}>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="10"/>
                    </svg>
                  </div>
                  <div className={styles.platformInfo}>
                    <span className={styles.platformName}>Zora</span>
                    <span className={styles.platformDesc}>Create a collectible on Zora</span>
                  </div>
                </button>

                <button
                  className={styles.shareOption}
                  onClick={() => handleShare('x')}
                >
                  <div className={styles.platformIcon}>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </div>
                  <div className={styles.platformInfo}>
                    <span className={styles.platformName}>X</span>
                    <span className={styles.platformDesc}>Share to your X timeline</span>
                  </div>
                </button>

                <button
                  className={styles.shareOption}
                  onClick={() => handleShare('copy')}
                >
                  <div className={styles.platformIcon}>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                    </svg>
                  </div>
                  <div className={styles.platformInfo}>
                    <span className={styles.platformName}>Copy Link</span>
                    <span className={styles.platformDesc}>Copy link to clipboard</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

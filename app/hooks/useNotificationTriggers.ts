"use client";
import { useEffect, useRef } from 'react';
import { useNotifications } from '../contexts/NotificationContext';

interface UseNotificationTriggersProps {
  isConnected: boolean;
  address?: string;
  posts: any[];
}

export const useNotificationTriggers = ({ isConnected, address, posts }: UseNotificationTriggersProps) => {
  const { addNotification, clearAllNotifications } = useNotifications();
  const previousPostsRef = useRef<any[]>([]);
  const previousUsdcRef = useRef<Record<string, number>>({});
  const previousNftRef = useRef<Record<string, number>>({});
  const hasInitialized = useRef(false);

  // Clear any test notifications on first load
  useEffect(() => {
    if (!hasInitialized.current) {
      clearAllNotifications();
      hasInitialized.current = true;
    }
  }, [clearAllNotifications]);

  // Monitor for new posts - only show real-time notifications
  useEffect(() => {
    if (posts.length > previousPostsRef.current.length && previousPostsRef.current.length > 0) {
      const newPosts = posts.slice(0, posts.length - previousPostsRef.current.length);
      
      newPosts.forEach((post) => {
        // Only notify for other people's posts, not your own
        if (post.wallet_address !== address) {
          addNotification({
            type: 'activity',
            title: 'New Activity Posted',
            message: `${post.user_name} shared: "${post.activity.substring(0, 50)}${post.activity.length > 50 ? '...' : ''}"`,
            data: { postId: post.id, userId: post.wallet_address }
          });
        }
      });
    }
    
    previousPostsRef.current = [...posts];
  }, [posts, address, addNotification]);

  // Monitor for USDC changes
  useEffect(() => {
    posts.forEach((post) => {
      const postId = post.id;
      const currentUsdc = post.usdc_earned || 0;
      const previousUsdc = previousUsdcRef.current[postId] || 0;
      
      if (currentUsdc > previousUsdc && previousUsdcRef.current[postId] !== undefined) {
        const amount = currentUsdc - previousUsdc;
        const isOwnPost = post.wallet_address === address;
        
        addNotification({
          type: 'usdc',
          title: isOwnPost ? 'USDC Received!' : 'USDC Sent',
          message: isOwnPost 
            ? `You received $${(amount / 100).toFixed(2)} USDC for your activity!`
            : `You sent $${(amount / 100).toFixed(2)} USDC to ${post.user_name}`,
          data: { postId, amount, recipient: post.user_name }
        });
      }
      
      previousUsdcRef.current[postId] = currentUsdc;
    });
  }, [posts, address, addNotification]);

  // Monitor for NFT changes
  useEffect(() => {
    posts.forEach((post) => {
      const postId = post.id;
      const currentNft = post.nft_count || 0;
      const previousNft = previousNftRef.current[postId] || 0;
      
      if (currentNft > previousNft && previousNftRef.current[postId] !== undefined) {
        const isOwnPost = post.wallet_address === address;
        
        addNotification({
          type: 'nft',
          title: isOwnPost ? 'NFT Minted!' : 'NFT Sent',
          message: isOwnPost 
            ? `Someone minted an NFT for your activity!`
            : `You minted an NFT for ${post.user_name}'s activity`,
          data: { postId, recipient: post.user_name }
        });
      }
      
      previousNftRef.current[postId] = currentNft;
    });
  }, [posts, address, addNotification]);

  // No welcome notification - only show real-time alerts
};

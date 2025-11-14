"use client";
import { useEffect, useRef } from 'react';
import { useNotifications } from '../contexts/NotificationContext';

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

interface UseNotificationTriggersProps {
  address?: string;
  posts: Post[];
  isConnected?: boolean;
}

export const useNotificationTriggers = ({ address, posts, isConnected }: UseNotificationTriggersProps) => {
  const { addNotification, clearAllNotifications } = useNotifications();
  const previousPostsRef = useRef<Post[]>([]);
  const previousUsdcRef = useRef<Record<string, number>>({});
  const previousNftRef = useRef<Record<string, number>>({});
  const hasInitialized = useRef(false);
  const sentNotificationsRef = useRef<Set<string>>(new Set());

  // Clear any test notifications on first load
  useEffect(() => {
    if (!hasInitialized.current) {
      clearAllNotifications();
      hasInitialized.current = true;
    }
  }, [clearAllNotifications]);

  // Monitor for new posts by ID (robust even when initial list is empty)
  // Only trigger if wallet is connected
  useEffect(() => {
    if (!isConnected || !address) return;

    const prevIds = new Set(previousPostsRef.current.map((p) => p.id));
    const newlyAdded = posts.filter((p) => !prevIds.has(p.id));

    if (newlyAdded.length > 0) {
      newlyAdded.forEach((post) => {
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
  }, [posts, address, addNotification, isConnected]);

  // Monitor for USDC changes
  // Only trigger if wallet is connected
  useEffect(() => {
    if (!isConnected || !address) return;

    posts.forEach((post) => {
      const postId = post.id;
      const currentUsdc = post.usdc_earned || 0;
      const previousUsdc = previousUsdcRef.current[postId] || 0;
      
      if (currentUsdc > previousUsdc && previousUsdcRef.current[postId] !== undefined) {
        const amount = currentUsdc - previousUsdc;
        const isOwnPost = post.wallet_address === address;
        
        // Create unique key to prevent duplicate notifications
        const notificationKey = `usdc-${postId}-${currentUsdc}`;
        
        // Only send if we haven't sent this notification already
        if (!sentNotificationsRef.current.has(notificationKey)) {
          sentNotificationsRef.current.add(notificationKey);
          
          addNotification({
            type: 'usdc',
            title: isOwnPost ? 'USDC Received!' : 'USDC Sent',
            message: isOwnPost 
              ? `You received $${(amount / 100).toFixed(2)} USDC for your activity!`
              : `You sent $${(amount / 100).toFixed(2)} USDC to ${post.user_name}`,
            data: { postId, amount, recipient: post.user_name }
          });
          
          // Clean up old notification keys after 5 minutes to prevent memory leak
          setTimeout(() => {
            sentNotificationsRef.current.delete(notificationKey);
          }, 5 * 60 * 1000);
        }
      }
      
      previousUsdcRef.current[postId] = currentUsdc;
    });
  }, [posts, address, addNotification, isConnected]);

  // Monitor for NFT changes
  // Only trigger if wallet is connected
  useEffect(() => {
    if (!isConnected || !address) return;

    posts.forEach((post) => {
      const postId = post.id;
      const currentNft = post.nft_count || 0;
      const previousNft = previousNftRef.current[postId] || 0;
      
      if (currentNft > previousNft && previousNftRef.current[postId] !== undefined) {
        const isOwnPost = post.wallet_address === address;
        
        // Create unique key to prevent duplicate notifications
        const notificationKey = `nft-${postId}-${currentNft}`;
        
        // Only send if we haven't sent this notification already
        if (!sentNotificationsRef.current.has(notificationKey)) {
          sentNotificationsRef.current.add(notificationKey);
          
          addNotification({
            type: 'nft',
            title: isOwnPost ? 'NFT Minted!' : 'NFT Sent',
            message: isOwnPost 
              ? `Someone minted an NFT for your activity!`
              : `You minted an NFT for ${post.user_name}'s activity`,
            data: { postId, recipient: post.user_name }
          });
          
          // Clean up old notification keys after 5 minutes to prevent memory leak
          setTimeout(() => {
            sentNotificationsRef.current.delete(notificationKey);
          }, 5 * 60 * 1000);
        }
      }
      
      previousNftRef.current[postId] = currentNft;
    });
  }, [posts, address, addNotification, isConnected]);

  // No welcome notification - only show real-time alerts
};

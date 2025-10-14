// Type definitions for Baselifestyle

export interface Post {
  id: string;
  userId: number;
  userName: string;
  userAvatar?: string;
  activity: string;
  category: string;
  timestamp: number;
  nftCount: number;
  usdcEarned: number; // Total USDC earned in cents (e.g., 100 = $1.00)
}

export interface AuthResponse {
  success: boolean;
  user?: {
    fid: number;
    issuedAt?: number;
    expiresAt?: number;
  };
  message?: string;
}

export interface NFT {
  tokenId: string;
  postId: string;
  senderId: number;
  recipientId: number;
  transactionHash?: string;
  metadataUri?: string;
  timestamp: number;
}

export interface USDCPayment {
  id: string;
  postId: string;
  senderId: number;
  recipientId: number;
  amount: number; // Amount in USDC (with decimals)
  transactionHash: string;
  timestamp: number;
}

export interface User {
  fid: number;
  displayName: string;
  pfpUrl?: string;
  username?: string;
  walletAddress?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

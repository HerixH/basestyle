import { createPublicClient, createWalletClient, custom, http } from 'viem';
import { base, baseSepolia } from 'viem/chains';

// Contract ABI for AppreciationNFT
export const APPRECIATION_NFT_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "recipient", "type": "address" },
      { "internalType": "string", "name": "postId", "type": "string" },
      { "internalType": "string", "name": "uri", "type": "string" }
    ],
    "name": "mintAppreciation",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
    "name": "getAppreciation",
    "outputs": [
      {
        "components": [
          { "internalType": "string", "name": "postId", "type": "string" },
          { "internalType": "address", "name": "sender", "type": "address" },
          { "internalType": "address", "name": "recipient", "type": "address" },
          { "internalType": "uint256", "name": "timestamp", "type": "uint256" }
        ],
        "internalType": "struct AppreciationNFT.AppreciationData",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
    "name": "tokenURI",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" },
      { "indexed": false, "internalType": "string", "name": "postId", "type": "string" },
      { "indexed": true, "internalType": "address", "name": "sender", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "recipient", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "tokenURI", "type": "string" }
    ],
    "name": "AppreciationMinted",
    "type": "event"
  }
] as const;

// Get contract address from environment
export const NFT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as `0x${string}`;

// Determine chain (use testnet for development)
const isProduction = process.env.NODE_ENV === 'production';
export const CHAIN = isProduction ? base : baseSepolia;

// Create public client for reading from the contract
export const publicClient = createPublicClient({
  chain: CHAIN,
  transport: http()
});

// Helper function to create metadata for NFT
export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

export function createAppreciationMetadata(
  postId: string,
  activity: string,
  userName: string,
  category: string
): NFTMetadata {
  return {
    name: `Baselifytle Appreciation #${postId.slice(0, 8)}`,
    description: `Appreciation NFT for: "${activity.slice(0, 100)}..." by ${userName}`,
    image: "ipfs://QmYourDefaultImageHash", // Replace with your default image
    attributes: [
      { trait_type: "Post ID", value: postId },
      { trait_type: "Creator", value: userName },
      { trait_type: "Category", value: category },
      { trait_type: "Timestamp", value: Date.now() },
    ],
  };
}

// Helper to get wallet client (client-side only)
export function getWalletClient() {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('Ethereum provider not found');
  }
  
  return createWalletClient({
    chain: CHAIN,
    transport: custom(window.ethereum)
  });
}


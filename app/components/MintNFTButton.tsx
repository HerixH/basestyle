"use client";
import { useState } from "react";
import { 
  Transaction, 
  TransactionButton,
  TransactionStatus,
  TransactionStatusLabel,
  TransactionStatusAction,
} from '@coinbase/onchainkit/transaction';
import type { LifecycleStatus } from '@coinbase/onchainkit/transaction';
import { CHAIN, NFT_CONTRACT_ADDRESS, APPRECIATION_NFT_ABI } from '../lib/nft-contract';
import { encodeFunctionData } from 'viem';
import styles from "./SendUSDCButton.module.css"; // Reuse the same styles

interface MintNFTButtonProps {
  postId: string;
  recipientAddress: string;
  recipientName: string;
  activity: string;
  category: string;
  onSuccess?: (tokenId: string, txHash: string) => void;
}

export default function MintNFTButton({ 
  postId, 
  recipientAddress, 
  recipientName,
  activity,
  category,
  onSuccess 
}: MintNFTButtonProps) {
  const [isMinting, setIsMinting] = useState(false);

  const handleSuccess = async (status: LifecycleStatus) => {
    if (status.statusName === 'success' && status.statusData?.transactionReceipts?.[0]?.transactionHash) {
      const txHash = status.statusData.transactionReceipts[0].transactionHash;
      console.log('NFT minted successfully:', txHash);
      
      // In a real app, you'd parse the logs to get the token ID
      // For now, we'll use the tx hash as a placeholder
      if (onSuccess) {
        onSuccess(txHash, txHash);
      }
      
      setIsMinting(false);
    }
  };

  // Create metadata URI (in production, upload to IPFS first)
  const metadataUri = `data:application/json;base64,${btoa(JSON.stringify({
    name: `Baselifestyle Appreciation`,
    description: `Appreciation for: "${activity.slice(0, 100)}..." by ${recipientName}`,
    attributes: [
      { trait_type: "Post ID", value: postId },
      { trait_type: "Creator", value: recipientName },
      { trait_type: "Category", value: category },
      { trait_type: "Timestamp", value: Date.now() },
    ],
  }))}`;

  // Encode the mint function call
  const mintData = encodeFunctionData({
    abi: APPRECIATION_NFT_ABI,
    functionName: 'mintAppreciation',
    args: [recipientAddress as `0x${string}`, postId, metadataUri]
  });

  const calls = [
    {
      to: NFT_CONTRACT_ADDRESS,
      data: mintData as `0x${string}`,
    },
  ];

  if (!NFT_CONTRACT_ADDRESS) {
    return (
      <button className={styles.sendButton} disabled>
        NFT Contract Not Configured
      </button>
    );
  }

  return (
    <Transaction
      chainId={CHAIN.id}
      calls={calls}
      onStatus={handleSuccess}
    >
      <TransactionButton 
        className={styles.sendButton}
        text={isMinting ? "Minting..." : "Mint NFT"}
        disabled={isMinting}
      />
      <TransactionStatus>
        <TransactionStatusLabel />
        <TransactionStatusAction />
      </TransactionStatus>
    </Transaction>
  );
}


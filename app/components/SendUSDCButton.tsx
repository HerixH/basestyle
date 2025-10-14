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
import { base } from 'viem/chains';
import styles from "./SendUSDCButton.module.css";

// USDC Contract on Base Mainnet
const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

interface SendUSDCButtonProps {
  postId: string;
  recipientAddress: string;
  recipientName: string;
  onSuccess?: (amount: number, txHash: string) => void;
}

export default function SendUSDCButton({ 
  postId: _postId, 
  recipientAddress, 
  recipientName,
  onSuccess 
}: SendUSDCButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState("1");

  const handleSuccess = (status: LifecycleStatus) => {
    if (status.statusName === 'success' && status.statusData?.transactionReceipts?.[0]?.transactionHash) {
      const txHash = status.statusData.transactionReceipts[0].transactionHash;
      console.log('USDC sent successfully:', txHash);
      
      // Call the onSuccess callback
      if (onSuccess) {
        onSuccess(parseFloat(amount), txHash);
      }
      
      // Close modal after a short delay
      setTimeout(() => {
        setShowModal(false);
        setAmount("1");
      }, 2000);
    }
  };

  // Create USDC transfer transaction
  const parsedAmount = parseFloat(amount);
  const isValidAmount = !isNaN(parsedAmount) && parsedAmount > 0;
  
  const calls = isValidAmount ? [
    {
      to: USDC_ADDRESS as `0x${string}`,
      data: `0xa9059cbb${recipientAddress.slice(2).padStart(64, '0')}${BigInt(Math.floor(parsedAmount * 1_000_000)).toString(16).padStart(64, '0')}` as `0x${string}`,
    },
  ] : [];

  return (
    <>
      <button 
        className={styles.sendButton}
        onClick={() => setShowModal(true)}
      >
        Send USDC
      </button>

      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button 
              className={styles.closeButton}
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>

            <h2 className={styles.modalTitle}>Send USDC to {recipientName}</h2>
            
            <div className={styles.amountSection}>
              <label htmlFor="amount" className={styles.label}>
                Amount (USDC)
              </label>
              <div className={styles.inputGroup}>
                <span className={styles.currency}>$</span>
                <input
                  id="amount"
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className={styles.input}
                  placeholder="1.00"
                />
              </div>
              <p className={styles.hint}>
                Minimum: $0.10 USDC
              </p>
            </div>

            <Transaction
              chainId={base.id}
              calls={calls}
              onStatus={handleSuccess}
            >
              <TransactionButton 
                className={styles.transactionButton}
                text={`Send $${amount} USDC`}
              />
              <TransactionStatus>
                <TransactionStatusLabel />
                <TransactionStatusAction />
              </TransactionStatus>
            </Transaction>

            <p className={styles.info}>
              This will send USDC on Base network. Make sure you have enough USDC and ETH for gas fees.
            </p>
          </div>
        </div>
      )}
    </>
  );
}


"use client";

import { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useName } from "@coinbase/onchainkit/identity";
import styles from "./WalletConnect.module.css";

export default function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: baseName } = useName({ address: address as `0x${string}` });
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleConnect = () => {
    const coinbaseConnector = connectors.find((c) => c.id === "coinbaseWalletSDK");
    if (coinbaseConnector) {
      connect({ connector: coinbaseConnector });
      setShowModal(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setShowModal(false);
  };

  // Prevent hydration mismatch - only show signed in state after mounted
  if (mounted && isConnected && address) {
    const displayName = baseName || `${address.slice(0, 6)}...${address.slice(-4)}`;
    
    return (
      <div className={styles.container}>
        <button className={styles.walletButton} onClick={() => setShowModal(true)}>
          <svg className={styles.walletIcon} viewBox="0 0 24 24" fill="none">
            <path
              d="M21 18V19C21 20.1 20.1 21 19 21H5C3.89 21 3 20.1 3 19V5C3 3.9 3.89 3 5 3H19C20.1 3 21 3.9 21 5V6H12C10.89 6 10 6.9 10 8V16C10 17.1 10.89 18 12 18H21ZM12 16H22V8H12V16ZM16 13.5C15.17 13.5 14.5 12.83 14.5 12C14.5 11.17 15.17 10.5 16 10.5C16.83 10.5 17.5 11.17 17.5 12C17.5 12.83 16.83 13.5 16 13.5Z"
              fill="currentColor"
            />
          </svg>
          <span className={styles.address}>
            {displayName}
          </span>
          {baseName && (
            <span className={styles.baseNameBadge}>
              <svg className={styles.verifiedIcon} viewBox="0 0 24 24" fill="none">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
              </svg>
            </span>
          )}
        </button>

        {showModal && (
          <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <button className={styles.closeButton} onClick={() => setShowModal(false)}>
                ×
              </button>
              
              <h2 className={styles.modalTitle}>Signed In</h2>
              
              {baseName && (
                <div className={styles.baseNameSection}>
                  <div className={styles.baseNameDisplay}>
                    <span className={styles.baseName}>{baseName}</span>
                    <svg className={styles.verifiedIconLarge} viewBox="0 0 24 24" fill="none">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
                    </svg>
                  </div>
                  <p className={styles.baseNameHint}>Your Base Name</p>
                </div>
              )}
              
              <div className={styles.addressDisplay}>
                <label className={styles.label}>Wallet Address</label>
                <div className={styles.addressBox}>
                  <code>{address}</code>
                </div>
                <p className={styles.hint}>
                  This is your Base wallet address where you&apos;ll receive USDC payments
                </p>
              </div>

              <button className={styles.disconnectButton} onClick={handleDisconnect}>
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Show sign in button for all other states (not mounted or not connected)
  return (
    <div className={styles.container}>
      <button 
        className={styles.connectButton} 
        onClick={handleConnect}
        disabled={!mounted}
      >
        <svg className={styles.walletIcon} viewBox="0 0 24 24" fill="none">
          <path
            d="M21 18V19C21 20.1 20.1 21 19 21H5C3.89 21 3 20.1 3 19V5C3 3.9 3.89 3 5 3H19C20.1 3 21 3.9 21 5V6H12C10.89 6 10 6.9 10 8V16C10 17.1 10.89 18 12 18H21ZM12 16H22V8H12V16ZM16 13.5C15.17 13.5 14.5 12.83 14.5 12C14.5 11.17 15.17 10.5 16 10.5C16.83 10.5 17.5 11.17 17.5 12C17.5 12.83 16.83 13.5 16 13.5Z"
            fill="currentColor"
          />
        </svg>
        Sign In
      </button>
    </div>
  );
}


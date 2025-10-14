"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import styles from "./page.module.css";

export default function Success() {
  const router = useRouter();
  const { context } = useMiniKit();

  useEffect(() => {
    // Redirect back to home after 3 seconds
    const timer = setTimeout(() => {
      router.push("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.successIcon}>✨</div>
        
        <h1 className={styles.title}>Activity Posted!</h1>
        
        <p className={styles.message}>
          Great job, {context?.user?.displayName || "there"}! Your activity has been shared with the community.
        </p>

        <div className={styles.info}>
          <p>People can now send you NFTs to show their appreciation! 💎</p>
        </div>

        <button 
          className={styles.backButton}
          onClick={() => router.push("/")}
        >
          Back to Feed
        </button>

        <p className={styles.autoRedirect}>
          Redirecting in 3 seconds...
        </p>
      </div>
    </div>
  );
}

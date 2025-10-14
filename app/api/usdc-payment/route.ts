import { NextRequest, NextResponse } from "next/server";

/**
 * USDC Payment Tracking API
 * 
 * This endpoint records USDC payments made through the app.
 * It tracks transaction hashes and updates user balances.
 */

interface USDCPayment {
  id: string;
  postId: string;
  senderId: number;
  recipientId: number;
  amount: number; // Amount in cents (e.g., 100 = $1.00)
  transactionHash: string;
  timestamp: number;
}

// In-memory storage (replace with database in production)
const payments: USDCPayment[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postId, senderId, recipientId, amount, transactionHash } = body;

    // Validate input
    if (!postId || !senderId || !recipientId || !amount || !transactionHash) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { success: false, message: "Amount must be greater than 0" },
        { status: 400 }
      );
    }

    // Create payment record
    const payment: USDCPayment = {
      id: Date.now().toString(),
      postId,
      senderId,
      recipientId,
      amount,
      transactionHash,
      timestamp: Date.now(),
    };

    payments.push(payment);

    // TODO: Update post's USDC earned in database
    // TODO: Verify transaction on Base blockchain
    // Example:
    /*
    import { createPublicClient, http } from 'viem';
    import { base } from 'viem/chains';
    
    const client = createPublicClient({
      chain: base,
      transport: http()
    });
    
    const receipt = await client.getTransactionReceipt({
      hash: transactionHash as `0x${string}`
    });
    
    if (receipt.status !== 'success') {
      return NextResponse.json(
        { success: false, message: "Transaction failed" },
        { status: 400 }
      );
    }
    */

    console.log("USDC payment recorded:", payment);

    return NextResponse.json(
      { 
        success: true, 
        payment,
        message: "Payment recorded successfully"
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error recording USDC payment:", error);
    return NextResponse.json(
      { success: false, message: "Failed to record payment" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");
    const userId = searchParams.get("userId");

    let filteredPayments = payments;

    if (postId) {
      // Get all payments for a specific post
      filteredPayments = payments.filter((p) => p.postId === postId);
    } else if (userId) {
      // Get all payments sent or received by a user
      const userIdNum = parseInt(userId);
      filteredPayments = payments.filter(
        (p) => p.senderId === userIdNum || p.recipientId === userIdNum
      );
    }

    // Calculate total earned (received)
    const totalEarned = userId 
      ? filteredPayments
          .filter((p) => p.recipientId === parseInt(userId))
          .reduce((sum, p) => sum + p.amount, 0)
      : 0;

    // Calculate total sent
    const totalSent = userId
      ? filteredPayments
          .filter((p) => p.senderId === parseInt(userId))
          .reduce((sum, p) => sum + p.amount, 0)
      : 0;

    return NextResponse.json({
      success: true,
      payments: filteredPayments,
      stats: userId ? {
        totalEarned,
        totalSent,
        totalEarnedUSD: (totalEarned / 100).toFixed(2),
        totalSentUSD: (totalSent / 100).toFixed(2),
      } : undefined,
    });
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}


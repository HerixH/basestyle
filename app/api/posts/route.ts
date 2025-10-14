import { NextRequest, NextResponse } from "next/server";

// In-memory storage (replace with database in production)
const posts: Array<{
  id: string;
  userId: number;
  userName: string;
  userAvatar?: string;
  activity: string;
  timestamp: number;
  nftCount: number;
  usdcEarned: number; // Amount in cents
}> = [];

export async function GET() {
  try {
    // Return posts sorted by timestamp (newest first)
    const sortedPosts = [...posts].sort((a, b) => b.timestamp - a.timestamp);
    return NextResponse.json({ success: true, posts: sortedPosts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, userName, userAvatar, activity } = body;

    // Validate input
    if (!userId || !userName || !activity) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (activity.length > 280) {
      return NextResponse.json(
        { success: false, message: "Activity must be 280 characters or less" },
        { status: 400 }
      );
    }

    // Create new post
    const newPost = {
      id: Date.now().toString(),
      userId,
      userName,
      userAvatar,
      activity,
      timestamp: Date.now(),
      nftCount: 0,
      usdcEarned: 0,
    };

    posts.push(newPost);

    return NextResponse.json({ success: true, post: newPost }, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create post" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { postId, action, amount } = body;

    if (!postId || !action) {
      return NextResponse.json(
        { success: false, message: "Post ID and action are required" },
        { status: 400 }
      );
    }

    // Find post
    const postIndex = posts.findIndex((p) => p.id === postId);
    
    if (postIndex === -1) {
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    // Update post based on action
    if (action === "increment_nft") {
      posts[postIndex].nftCount += 1;
    } else if (action === "add_usdc") {
      if (!amount || amount <= 0) {
        return NextResponse.json(
          { success: false, message: "Valid USDC amount is required" },
          { status: 400 }
        );
      }
      posts[postIndex].usdcEarned += amount;
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid action" },
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      post: posts[postIndex] 
    });
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update post" },
      { status: 500 }
    );
  }
}

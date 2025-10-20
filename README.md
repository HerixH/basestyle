# Baselifestyle - Share Your Daily Wins

**Baselifestyle** is a social mini app built on Base where users can share their daily activities and receive **USDC payments** and NFTs from people who love their content. It's a new way to celebrate productivity, motivation, and community engagement through blockchain rewards.

##  Features

-  **Post Daily Activities** - Share what you accomplished today with text and images
-  **Image Upload** - Add photos to your posts, stored securely in Supabase
-  **Send USDC** - Reward great content with real USDC on Base blockchain
-  **Mint NFTs** - Posts with images can be minted as NFTs
-  **Send NFTs** - Give NFT badges to creators you appreciate
-  **Supabase Authentication** - Secure email/password authentication
-  **Beautiful UI** - Modern, responsive design with smooth animations
-  **Real-time Updates** - See USDC earnings and NFT counts update instantly
-  **OnchainKit Integration** - Built-in wallet connection and transactions

##  Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Supabase** - Authentication and database
- **OnchainKit** - Coinbase's toolkit for blockchain integration
- **Farcaster SDK** - Social features and MiniKit
- **Viem & Wagmi** - Ethereum interaction libraries
- **Base Blockchain** - Layer 2 for fast, cheap transactions
- **USDC on Base** - Native stablecoin payments

##  USDC Integration

This app uses **USDC on Base** for content creator rewards:

- **USDC Contract on Base**: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- **Network**: Base Mainnet (Chain ID: 8453)
- **Benefits**:
  - Real monetary value for creators
  - Low transaction fees on Base
  - Fast settlement times
  - Stable value (1 USDC = $1 USD)

### How USDC Payments Work

1. User clicks "Send USDC" on a post they love
2. OnchainKit modal opens for amount selection
3. User approves transaction in their wallet
4. USDC is transferred on Base blockchain
5. Post's earnings update in real-time
6. Transaction is recorded on-chain

##  Prerequisites

Before getting started, make sure you have:

- Node.js 18+ installed
- [Supabase](https://supabase.com/) account (free tier available)
- [Coinbase Developer Platform](https://portal.cdp.coinbase.com/) API Key
- [Vercel](https://vercel.com/) account for hosting (optional)
- **Wallet with USDC on Base** (for testing payments)

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/HerixH/basestyle.git
cd basestyle
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Create a new project at [https://supabase.com](https://supabase.com)
2. Go to Settings → API to get your project URL and anon key

3. **Create the posts table**:
   - Go to SQL Editor → New query
   - Copy and paste the contents of `supabase-posts-setup.sql`
   - Click "Run" to create the table
   - See [SETUP_DATABASE.md](./SETUP_DATABASE.md) for detailed instructions

4. **Set up Storage for images**:
   - Go to Storage → Create new bucket
   - Name it `post-images`
   - Enable "Public bucket"
   - Add the required policies (see [SETUP_DATABASE.md](./SETUP_DATABASE.md))

5. **Enable Realtime (recommended)**:
   - Go to Database → Replication
   - Enable replication for the `posts` table

### 4. Configure environment variables

Create a `.env.local` file in the root directory:

```bash
# Coinbase Developer Platform
NEXT_PUBLIC_CDP_API_KEY=your-cdp-api-key-here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Optional
NEXT_PUBLIC_URL=http://localhost:3000
```

**Get your Coinbase API key**: https://portal.cdp.coinbase.com/
**Get your Supabase credentials**: https://app.supabase.com/project/_/settings/api

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

You'll be redirected to the sign-in page. Create an account to get started!

### 6. Testing USDC Payments

To test USDC payments locally:

1. Connect your wallet (must have Base network)
2. Get some Base ETH for gas fees
3. Get USDC on Base from:
   - [Coinbase](https://www.coinbase.com/) - Send from Coinbase to Base
   - [Base Bridge](https://bridge.base.org/) - Bridge from Ethereum
   - [Uniswap](https://app.uniswap.org/) - Swap for USDC on Base

##  Customization

### Update App Configuration

Edit `minikit.config.ts` to customize your app's metadata:

```typescript
export const minikitConfig = {
  miniapp: {
    name: "Your App Name",
    subtitle: "Your Subtitle",
    description: "Your Description",
    iconUrl: `${ROOT_URL}/icon.png`,
    splashImageUrl: `${ROOT_URL}/hero.png`,
    // ... more configuration
  },
};
```

### Styling

- Main styles: `app/page.module.css`
- Post card styles: `app/components/PostCard.module.css`
- USDC button: `app/components/SendUSDCButton.module.css`
- Global styles: `app/globals.css`

### Add Custom Images

Replace images in the `/public` folder:
- `icon.png` - App icon (512x512px recommended)
- `hero.png` - Hero/splash image
- `screenshot.png` - App screenshot for listings

##  API Routes

### Posts API (`/api/posts`)

**GET** - Fetch all posts
```bash
GET /api/posts
```

**POST** - Create a new post
```json
{
  "userId": 123,
  "userName": "John Doe",
  "userAvatar": "https://...",
  "activity": "Completed a 5K run!"
}
```

**PATCH** - Update post (NFT or USDC)
```json
{
  "postId": "123",
  "action": "add_usdc",
  "amount": 500
}
```

### USDC Payment API (`/api/usdc-payment`)

**POST** - Record USDC payment
```json
{
  "postId": "123",
  "senderId": 456,
  "recipientId": 789,
  "amount": 500,
  "transactionHash": "0x..."
}
```

**GET** - Fetch payment history
```bash
GET /api/usdc-payment?userId=123
```

### NFT API (`/api/nft`)

**POST** - Mint NFT for a post
```json
{
  "postId": "123",
  "senderId": 456,
  "recipientId": 789,
  "recipientAddress": "0x..."
}
```

##  Deployment

### 1. Deploy to Vercel

```bash
vercel --prod
```

### 2. Add Environment Variables to Vercel

```bash
vercel env add NEXT_PUBLIC_PROJECT_NAME production
vercel env add NEXT_PUBLIC_ONCHAINKIT_API_KEY production
vercel env add NEXT_PUBLIC_URL production
```

Set `NEXT_PUBLIC_URL` to your production URL (e.g., `https://your-app.vercel.app`)

### 3. Configure Account Association

1. Go to [Farcaster Manifest Tool](https://farcaster.xyz/~/developers/mini-apps/manifest)
2. Enter your domain (e.g., `your-app.vercel.app`)
3. Click "Generate account association" and sign with your Farcaster wallet
4. Copy the `accountAssociation` object into `minikit.config.ts`:

```typescript
accountAssociation: {
  header: "your-header",
  payload: "your-payload",
  signature: "your-signature"
}
```

5. Redeploy: `vercel --prod`

##  Testing

### Preview Your App

1. Visit [base.dev/preview](https://base.dev/preview)
2. Enter your app URL
3. Test the embeds and launch button
4. Verify account association
5. Check metadata
6. **Test USDC payments** with a small amount

### Publish to Base App

Create a post in the Base app with your app's URL to publish it.

##  Production Considerations

### Database Integration

Replace in-memory storage with a real database:

```typescript
// Example with PostgreSQL/Prisma
import { prisma } from '@/lib/prisma';

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { timestamp: 'desc' },
    include: { usdcPayments: true }
  });
  return NextResponse.json({ success: true, posts });
}
```

### Transaction Verification

Verify USDC transactions on Base:

```typescript
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';

const client = createPublicClient({
  chain: base,
  transport: http()
});

// Verify transaction
const receipt = await client.getTransactionReceipt({
  hash: transactionHash as `0x${string}`
});

if (receipt.status === 'success') {
  // Transaction confirmed
}
```

### Security Best Practices

1. **Verify wallet addresses** - Ensure recipient addresses are correct
2. **Rate limiting** - Prevent spam transactions
3. **Transaction monitoring** - Watch for failed transactions
4. **User balance checks** - Verify users have sufficient USDC
5. **Gas estimation** - Help users understand costs

### Scaling Considerations

1. **Database** - Use PostgreSQL or MongoDB for production
2. **Caching** - Redis for frequently accessed data
3. **CDN** - For images and static assets
4. **Indexing** - Index blockchain events for faster queries
5. **Webhooks** - Listen for Base blockchain events

##  Project Structure

```
basestyle/
├── app/
│   ├── api/
│   │   ├── auth/              # Authentication endpoint
│   │   ├── nft/               # NFT minting API
│   │   ├── posts/             # Posts CRUD API
│   │   └── usdc-payment/      # USDC payment tracking
│   ├── components/
│   │   ├── PostCard.tsx       # Individual post component
│   │   ├── PostCard.module.css
│   │   ├── SendUSDCButton.tsx # USDC payment component
│   │   └── SendUSDCButton.module.css
│   ├── types/
│   │   └── index.ts           # TypeScript definitions
│   ├── success/               # Success page
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Main app page
│   ├── page.module.css        # Page styles
│   └── rootProvider.tsx       # OnchainKit provider
├── public/                    # Static assets
├── minikit.config.ts          # Miniapp configuration
├── package.json
└── README.md
```

##  Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄License

This project is open source and available under the MIT License.

##  Links

- [Base Documentation](https://docs.base.org/)
- [OnchainKit Docs](https://onchainkit.xyz/)
- [Farcaster Docs](https://docs.farcaster.xyz/)
- [Next.js Documentation](https://nextjs.org/docs)
- [USDC on Base](https://www.base.org/tokens/usdc)
- [Base Bridge](https://bridge.base.org/)

##  Ideas for Enhancement

-  **Leaderboard** - Show top earners and most generous supporters
- **Analytics Dashboard** - Track earnings, payments, and engagement
-  **Notifications** - Alert users when they receive USDC or NFTs
- **Daily Challenges** - Streaks and achievements with USDC rewards
-  **Follow System** - Follow favorite creators
-  **Comments** - Discuss posts
-  **Image Uploads** - Add photos to activities
- **Achievement Badges** - Special NFTs for milestones
-  **Tipping Tiers** - Preset USDC amounts (e.g., $1, $5, $10)
-  **Creator Stats** - Earnings history and trends
-  **Reward Pools** - Community funds for exceptional content
- **Featured Posts** - Highlight top content based on earnings

##  Support

If you have questions or need help:
- Open an issue on GitHub
- Join the Base Discord
- Check the [Base documentation](https://docs.base.org/)
- Visit [OnchainKit documentation](https://onchainkit.xyz/)

##  Learning Resources

- [Base Getting Started](https://docs.base.org/getting-started)
- [OnchainKit Transaction Guide](https://onchainkit.xyz/transaction/transaction)
- [USDC on Base](https://www.circle.com/en/usdc/base)
- [Viem Documentation](https://viem.sh/)

---

Built with  on Base Built By Herix Hanngandu (herix.base.eth)

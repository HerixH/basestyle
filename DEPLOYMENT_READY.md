# 🚀 Deployment Ready - Environment Variables Setup

Your app is ready to deploy! I've updated:
- ✅ New contract address: `0xc8BeAe45efC5bFad0B5f112C7c1953E22B01cc6F`
- ✅ Complete ABI with all functions (baselifestyle contract)
- ✅ Fixed all linting errors
- ✅ TypeScript configuration excludes contracts folder

## Required Environment Variables

### 1. NFT Contract (Already Set)
```bash
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0xc8BeAe45efC5bFad0B5f112C7c1953E22B01cc6F
```

### 2. Supabase (REQUIRED - Your app won't work without these)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Where to find these:**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to Settings → API
4. Copy "Project URL" and "anon public" key

### 3. Coinbase Developer Platform (Optional but recommended)
```bash
NEXT_PUBLIC_CDP_API_KEY=your_cdp_api_key
```

**Where to get this:**
1. Go to https://portal.cdp.coinbase.com/
2. Create an API key
3. Copy the key

## Quick Deploy to Vercel

### Option 1: Manual (Vercel Dashboard)
1. Go to: https://vercel.com/herix-hangandus-projects/baselifytle/settings/environment-variables
2. Add each variable:
   - `NEXT_PUBLIC_NFT_CONTRACT_ADDRESS` = `0xc8BeAe45efC5bFad0B5f112C7c1953E22B01cc6F`
   - `NEXT_PUBLIC_SUPABASE_URL` = `<your_value>`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `<your_value>`
   - `NEXT_PUBLIC_CDP_API_KEY` = `<your_value>` (optional)
3. Select all environments: Production, Preview, Development
4. Save

### Option 2: CLI (Faster)
Run these commands in your terminal and paste the values when prompted:

```bash
vercel env add NEXT_PUBLIC_NFT_CONTRACT_ADDRESS
# Paste: 0xc8BeAe45efC5bFad0B5f112C7c1953E22B01cc6F

vercel env add NEXT_PUBLIC_SUPABASE_URL
# Paste your Supabase URL

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Paste your Supabase anon key

vercel env add NEXT_PUBLIC_CDP_API_KEY
# Paste your CDP API key (optional)
```

Then deploy:
```bash
vercel --prod
```

## Contract Features Available

Your updated ABI includes all these functions:

### NFT Functions
- ✅ `mintAppreciation` - Mint NFTs for posts
- ✅ `getAppreciation` - Get NFT details
- ✅ `tokenURI` - Get NFT metadata
- ✅ `totalSupply` - Total NFTs minted
- ✅ `balanceOf` - User's NFT count
- ✅ `ownerOf` - Get NFT owner

### ERC721 Standard Functions
- ✅ `approve` - Approve transfers
- ✅ `transferFrom` - Transfer NFTs
- ✅ `safeTransferFrom` - Safe transfer with validation
- ✅ `setApprovalForAll` - Batch approvals

### Events
- ✅ `AppreciationMinted` - Emitted when NFT is minted
- ✅ `Transfer` - ERC721 transfer event
- ✅ `Approval` - ERC721 approval event

## Next Steps

1. **Add Supabase credentials** (see above)
2. **Deploy to production**:
   ```bash
   vercel --prod
   ```
3. **Test the app**:
   - Connect wallet
   - Post an activity
   - Mint NFT for another user's post
   - Send USDC

## Need Help?

- Supabase setup: See `SUPABASE_SETUP.md`
- Database migration: See `DATABASE_MIGRATION_GUIDE.md`
- Smart contracts: See `SMART_CONTRACT_SETUP.md`


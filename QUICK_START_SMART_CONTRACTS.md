# 🚀 Smart Contract Quick Start

Get your NFT smart contract running in 5 minutes!

## ⚡ Quick Setup (Step-by-Step)

### Step 1: Install Contract Tools
```bash
cd contracts
npm install
```

### Step 2: Set Up Your Wallet
1. Create `contracts/.env` file
2. Add your wallet private key:
```env
PRIVATE_KEY=your_private_key_from_metamask
BASESCAN_API_KEY=get_from_basescan.org
```

### Step 3: Get Testnet ETH
Visit: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
- Connect wallet
- Get free testnet ETH

### Step 4: Deploy Contract
```bash
# Test locally first (optional)
npm run compile
npm test

# Deploy to testnet
npm run deploy:testnet
```

### Step 5: Configure Your App
1. Copy the contract address from deployment output
2. Add to root `.env.local`:
```env
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0xYourContractAddress
```

### Step 6: Restart & Test
```bash
# In root directory
npm run dev
```

✅ Done! Try minting an NFT from a post!

---

## 🎯 What You Built

### Smart Contract Features:
- ✅ Mint appreciation NFTs on Base
- ✅ Store post metadata on-chain  
- ✅ Track sender & recipient
- ✅ ERC-721 standard (works with OpenSea, MetaMask)

### Frontend Integration:
- ✅ One-click NFT minting
- ✅ Transaction status updates
- ✅ Wallet integration via OnchainKit
- ✅ Real blockchain transactions

---

## 📋 Files Created

```
contracts/
├── AppreciationNFT.sol          ← Smart contract
├── scripts/deploy.ts            ← Deployment script
├── test/AppreciationNFT.test.ts ← Tests
└── hardhat.config.ts            ← Config

app/
├── lib/nft-contract.ts          ← Contract utilities
└── components/
    └── MintNFTButton.tsx        ← Mint button component
```

---

## 🔥 Production Deployment

When ready for mainnet:

### 1. Get Real ETH on Base
- Bridge ETH to Base: https://bridge.base.org
- Or buy directly on Coinbase

### 2. Deploy to Mainnet
```bash
cd contracts
npm run deploy:mainnet
```

### 3. Update Environment
```env
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0xYourMainnetAddress
NEXT_PUBLIC_CHAIN_ID=8453
```

### 4. Verify Contract
```bash
npx hardhat verify --network base YOUR_CONTRACT_ADDRESS
```

✅ Live on Base Mainnet!

---

## 💰 Costs

### Testnet (Free):
- ✅ Deploy: Free
- ✅ Mint NFT: Free
- ✅ All transactions: Free

### Mainnet:
- Deploy contract: ~$5-15 (one-time)
- Mint NFT: ~$0.10-0.50 per mint
- Varies with network activity

---

## 🛠️ Commands Reference

```bash
# Development
npm run compile      # Compile contracts
npm test            # Run tests
npm run deploy:testnet   # Deploy to Base Sepolia

# Production  
npm run deploy:mainnet   # Deploy to Base
npm run verify          # Verify on Basescan
```

---

## 🎨 Customization

### Change NFT Image
Edit `app/lib/nft-contract.ts`:
```typescript
image: "ipfs://YourImageHash"
```

### Change NFT Name
Edit `contracts/AppreciationNFT.sol`:
```solidity
constructor() ERC721("Your Name", "SYMBOL")
```

---

## 🆘 Common Issues

**"Contract not deployed"**
```bash
# Solution: Deploy first
cd contracts && npm run deploy:testnet
```

**"No ETH for gas"**
```bash
# Solution: Get testnet ETH
# Visit: https://www.coinbase.com/faucets
```

**"Wrong network"**
```bash
# Solution: Switch MetaMask to Base Sepolia
# Network: Base Sepolia
# RPC: https://sepolia.base.org
```

---

## 📱 How Users Mint NFTs

1. User clicks "Mint NFT" on a post
2. OnchainKit modal appears
3. User confirms in MetaMask
4. NFT mints on Base blockchain
5. NFT appears in their wallet
6. Post counter updates

---

## 🎉 Success Checklist

- [ ] Contract deployed to testnet
- [ ] Contract address in `.env.local`
- [ ] Test mint works in app
- [ ] NFT appears in MetaMask
- [ ] Transaction visible on Basescan
- [ ] Ready for mainnet!

---

## 📚 Full Documentation

For detailed guides, see:
- [`SMART_CONTRACT_SETUP.md`](./SMART_CONTRACT_SETUP.md) - Complete setup
- [`IMPLEMENTATION_SUMMARY.md`](./IMPLEMENTATION_SUMMARY.md) - Technical details
- [`ENV_SETUP_GUIDE.md`](./ENV_SETUP_GUIDE.md) - Environment config

---

## 🚀 What's Next?

### Enhancements:
- Add NFT images to IPFS
- Create NFT gallery view
- Add rarity tiers
- Integrate with OpenSea
- Add leaderboards

### Marketing:
- Tweet about your NFTs
- Share on Farcaster
- List on OpenSea
- Build community

---

**Need Help?** Check the troubleshooting section or review the full documentation!


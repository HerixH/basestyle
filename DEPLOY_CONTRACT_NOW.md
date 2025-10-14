# 🚀 Deploy Your NFT Smart Contract

## Quick Deployment Guide

Follow these steps to deploy your AppreciationNFT contract to Base.

---

## Step 1: Install Contract Dependencies

```bash
cd contracts
npm install
```

This will install:
- Hardhat
- OpenZeppelin contracts
- Deployment tools

---

## Step 2: Set Up Your Private Key

### A. Create `.env` file in `contracts` folder:

```bash
# In contracts directory
touch .env
```

### B. Add your wallet private key:

Open `contracts/.env` and add:

```env
PRIVATE_KEY=your_private_key_here
BASESCAN_API_KEY=your_basescan_api_key
```

### C. How to get your private key:

**From MetaMask:**
1. Open MetaMask
2. Click the 3 dots menu
3. Account Details → Show Private Key
4. Enter password
5. Copy the private key

⚠️ **IMPORTANT**: Never share this or commit it to git!

### D. Get Basescan API Key (for verification):

1. Go to https://basescan.org/myapikey
2. Sign up (free)
3. Create new API key
4. Copy and add to `.env`

---

## Step 3: Get ETH for Gas Fees

### For Testnet (Base Sepolia) - FREE:

1. Go to: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet
2. Connect your wallet
3. Request testnet ETH (free!)
4. Wait ~1 minute to receive

### For Mainnet (Base) - REAL ETH NEEDED:

**Option 1: Bridge from Ethereum**
- Go to: https://bridge.base.org
- Bridge ETH from Ethereum to Base
- Cost: ~$5-15 + bridge fees

**Option 2: Buy on Coinbase**
- Buy ETH on Coinbase
- Send to Base network
- Cheaper and easier!

---

## Step 4: Deploy to Testnet (Recommended First)

```bash
# Make sure you're in contracts directory
cd contracts

# Deploy to Base Sepolia testnet
npm run deploy:testnet
```

You should see:
```
Deploying AppreciationNFT contract...
Deploying contracts with account: 0xYourAddress
Account balance: 0.5 ETH
AppreciationNFT deployed to: 0xYourContractAddress
✅ Deployment complete!
```

**Copy the contract address!** You'll need it in Step 6.

---

## Step 5: Verify Contract on Basescan (Optional but Recommended)

```bash
npx hardhat verify --network baseSepolia YOUR_CONTRACT_ADDRESS
```

This makes your contract:
- ✅ Viewable on Basescan
- ✅ Shows source code
- ✅ Proves it's legitimate
- ✅ Builds trust with users

---

## Step 6: Add Contract Address to Your App

### A. Open your main `.env.local` file (in root directory)

### B. Add this line:

```env
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0xYourContractAddressHere
```

Replace `0xYourContractAddressHere` with the actual contract address from Step 4.

### C. For testnet, also add:

```env
NEXT_PUBLIC_CHAIN_ID=84532
```

---

## Step 7: Restart Your App

```bash
# In root directory (not contracts)
npm run dev
```

---

## Step 8: Test NFT Minting

1. Open your app in browser
2. Sign in with your wallet
3. Find a post
4. Click "Mint NFT"
5. Confirm transaction in wallet
6. ✅ NFT should be minted!

Check your wallet - the NFT should appear in your collection!

---

## 🎯 Deploy to Mainnet (Production)

Once testing works on testnet:

### 1. Get Real ETH on Base

You need ~$10-20 worth of ETH:
- $5-15 for deployment
- $5 for initial test transactions

### 2. Deploy to Base Mainnet

```bash
cd contracts
npm run deploy:mainnet
```

### 3. Verify on Basescan

```bash
npx hardhat verify --network base YOUR_CONTRACT_ADDRESS
```

### 4. Update `.env.local` for Production

```env
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0xYourMainnetContractAddress
NEXT_PUBLIC_CHAIN_ID=8453
```

### 5. Deploy Your App

Deploy to Vercel with the new environment variables.

---

## 💰 Cost Breakdown

### Testnet (Base Sepolia):
- Deployment: **FREE** ✨
- NFT Minting: **FREE** ✨
- All testing: **FREE** ✨

### Mainnet (Base):
- Deploy Contract: **~$5-15** (one-time)
- Mint NFT: **~$0.10-0.50** (per mint)
- Send USDC: **~$0.05-0.20** (per transaction)

---

## 🔍 Verify Deployment Worked

### Check on Basescan:

**Testnet:**
https://sepolia.basescan.org/address/YOUR_CONTRACT_ADDRESS

**Mainnet:**
https://basescan.org/address/YOUR_CONTRACT_ADDRESS

You should see:
- ✅ Contract created
- ✅ Balance: 0 ETH
- ✅ Transactions: 1 (deployment)
- ✅ Contract verified (if you ran verify)

---

## 🆘 Troubleshooting

### "Insufficient funds for gas"
→ You need ETH on Base network (not Ethereum mainnet!)
→ Use the faucet for testnet or bridge ETH for mainnet

### "Invalid private key"
→ Make sure there's no `0x` prefix in your `.env` file
→ Private key should be 64 characters

### "Network not configured"
→ Check `contracts/hardhat.config.ts` has Base networks
→ Make sure you're using the right network name

### "Contract not found in app"
→ Make sure `NEXT_PUBLIC_NFT_CONTRACT_ADDRESS` is set
→ Restart your Next.js dev server after adding env var

### Can't find `npm` command
→ Make sure you have Node.js 18+ installed
→ Download from: https://nodejs.org

---

## ✅ Success Checklist

After deployment:

- [ ] Contract deployed to testnet/mainnet
- [ ] Contract address copied
- [ ] Contract verified on Basescan
- [ ] Address added to `.env.local`
- [ ] App restarted
- [ ] Test NFT mint works
- [ ] NFT appears in wallet
- [ ] Transaction visible on Basescan

---

## 📚 Next Steps After Deployment

1. **Test thoroughly on testnet** before mainnet
2. **Add NFT images** to IPFS
3. **Share on social media** 
4. **Monitor transactions** on Basescan
5. **Consider adding** more features (galleries, leaderboards)

---

## 🎉 You're Ready!

Start with **Step 1** above and work through each step. The entire process takes about **10-15 minutes**.

**Questions?** Check the troubleshooting section or the detailed `SMART_CONTRACT_SETUP.md` guide.

Good luck! 🚀


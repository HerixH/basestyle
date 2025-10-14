# Smart Contract Implementation Guide

This guide will help you deploy and integrate the NFT smart contract for Baselifytle.

## 📋 Prerequisites

- Node.js 18+ installed
- A wallet with ETH on Base network (for gas fees)
- MetaMask or similar Web3 wallet

## 🚀 Step-by-Step Setup

### 1. Install Contract Dependencies

```bash
cd contracts
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the `contracts` directory:

```env
PRIVATE_KEY=your_wallet_private_key
BASESCAN_API_KEY=your_basescan_api_key
```

**How to get these:**
- **PRIVATE_KEY**: Export from MetaMask (Settings > Security & Privacy > Show Private Key)
  - ⚠️ NEVER share this or commit it to git
- **BASESCAN_API_KEY**: Get from https://basescan.org/myapikey

### 3. Compile the Contract

```bash
npm run compile
```

### 4. Deploy to Base Testnet (Recommended for testing)

First, get testnet ETH from the Base Sepolia faucet:
- https://www.coinbase.com/faucets/base-ethereum-goerli-faucet

Then deploy:

```bash
npm run deploy:testnet
```

### 5. Deploy to Base Mainnet (Production)

⚠️ Make sure you have real ETH on Base for gas fees!

```bash
npm run deploy:mainnet
```

### 6. Add Contract Address to Your App

After deployment, copy the contract address and add it to your main `.env` file:

```env
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0xYourContractAddressHere
```

### 7. Verify Contract on Basescan (Optional but Recommended)

```bash
npx hardhat verify --network base YOUR_CONTRACT_ADDRESS
```

## 🎨 Customize NFT Metadata

### Option 1: Use IPFS for Images (Recommended)

1. Upload your default NFT image to IPFS using:
   - [Pinata](https://pinata.cloud)
   - [NFT.Storage](https://nft.storage)
   - [Web3.Storage](https://web3.storage)

2. Update `app/lib/nft-contract.ts`:
   ```typescript
   image: "ipfs://YOUR_IPFS_HASH_HERE"
   ```

### Option 2: Generate Dynamic Images

Create an API endpoint that generates unique images per post:

```typescript
// app/api/nft-image/[postId]/route.ts
export async function GET(request: Request, { params }: { params: { postId: string } }) {
  // Generate image using Canvas or similar
  // Return image URL
}
```

Then use in metadata:
```typescript
image: `${process.env.NEXT_PUBLIC_URL}/api/nft-image/${postId}`
```

## 🔧 Smart Contract Features

Your `AppreciationNFT` contract includes:

- ✅ **ERC-721 Standard**: Full NFT compatibility
- ✅ **Metadata Storage**: IPFS-compatible tokenURI
- ✅ **Appreciation Tracking**: Stores sender, recipient, post ID
- ✅ **Event Emissions**: Easy to track on-chain
- ✅ **Ownable**: Contract owner can manage if needed

## 📊 Contract Methods

### Mint an NFT
```solidity
function mintAppreciation(
    address recipient,
    string memory postId,
    string memory uri
) public returns (uint256)
```

### Get Appreciation Data
```solidity
function getAppreciation(uint256 tokenId) 
    public view returns (AppreciationData memory)
```

### Get Total Supply
```solidity
function totalSupply() public view returns (uint256)
```

## 🔍 Testing Locally

Test the contract on a local Hardhat network:

```bash
# Start local node
npx hardhat node

# In another terminal, deploy
npm run deploy:local
```

## 💰 Cost Estimation

**Base Network (Mainnet):**
- Deploy contract: ~$5-15 (one-time)
- Mint NFT: ~$0.10-0.50 per mint
- Gas fees vary with network activity

**Base Sepolia (Testnet):**
- Free! Use testnet ETH from faucet

## 🛡️ Security Best Practices

1. ✅ Never commit `.env` files
2. ✅ Use a separate wallet for deployment (not your main wallet)
3. ✅ Test thoroughly on testnet first
4. ✅ Verify contract on Basescan for transparency
5. ✅ Consider adding access control for future upgrades

## 🎯 Next Steps

After deploying:

1. **Test minting** - Try minting an NFT from your app
2. **View on Basescan** - Check transactions and NFTs
3. **View in wallet** - NFTs should appear in MetaMask
4. **Add to OpenSea** - Your NFTs will automatically appear on OpenSea

## 📚 Additional Resources

- [Base Documentation](https://docs.base.org)
- [OnchainKit Docs](https://onchainkit.xyz)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
- [Hardhat Documentation](https://hardhat.org/docs)

## 🆘 Troubleshooting

### "Insufficient funds for gas"
- Make sure you have ETH on Base network (not Ethereum mainnet)
- Get testnet ETH from Base Sepolia faucet

### "Contract not configured"
- Ensure `NEXT_PUBLIC_NFT_CONTRACT_ADDRESS` is set in `.env`
- Restart your Next.js dev server after adding env variable

### "Transaction failed"
- Check you have enough ETH for gas
- Verify recipient address is valid
- Check contract is deployed correctly on the network

## 📞 Support

If you run into issues:
1. Check the console for error messages
2. Verify all environment variables are set
3. Ensure you're on the correct network (Base/Base Sepolia)
4. Check Basescan for transaction details


# Environment Variables Setup Guide

## Required Environment Variables

Create a `.env.local` file in the root directory with these variables:

```env
# Supabase (Already configured)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# NFT Smart Contract (Add after deployment)
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0xYourContractAddressHere

# Optional: Network Configuration
NEXT_PUBLIC_CHAIN_ID=8453  # Base Mainnet (use 84532 for Base Sepolia testnet)
```

## Getting the NFT Contract Address

After deploying your smart contract (see SMART_CONTRACT_SETUP.md):

1. Deploy the contract using the commands in `contracts/`
2. Copy the deployed contract address
3. Add it to `.env.local` as `NEXT_PUBLIC_NFT_CONTRACT_ADDRESS`
4. Restart your Next.js dev server

## Testing on Testnet

For testing, use Base Sepolia testnet:

```env
# Use testnet contract address
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0xYourTestnetContractAddress
NEXT_PUBLIC_CHAIN_ID=84532
```

Get testnet ETH from: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet

## Production Setup

For production deployment:

```env
# Production contract on Base Mainnet
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0xYourMainnetContractAddress
NEXT_PUBLIC_CHAIN_ID=8453
```

⚠️ Make sure `.env.local` and `.env` are in your `.gitignore` file!


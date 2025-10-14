# Baselifytle Smart Contracts

Smart contracts for the Baselifytle NFT appreciation system on Base.

## Quick Start

```bash
# Install dependencies
npm install

# Compile contracts
npm run compile

# Run tests
npm test

# Deploy to testnet
npm run deploy:testnet

# Deploy to mainnet
npm run deploy:mainnet
```

## Contract Overview

### AppreciationNFT.sol

An ERC-721 NFT contract that allows users to mint appreciation NFTs for posts they love.

**Key Features:**
- Mint NFTs to content creators
- Store post ID and appreciation metadata
- Track sender and recipient
- IPFS-compatible metadata storage

## Deployment Addresses

After deployment, your contract addresses will be:

- **Base Sepolia (Testnet)**: TBD
- **Base Mainnet**: TBD

## Security

- All contracts use OpenZeppelin libraries
- Full test coverage
- Audited patterns

## Documentation

See `../SMART_CONTRACT_SETUP.md` for detailed setup instructions.


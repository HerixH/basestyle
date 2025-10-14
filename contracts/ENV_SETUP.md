# Environment Variables Setup

Create a `.env` file in the `contracts` directory with the following variables:

```env
# Private key for deployment (NEVER commit this file to git)
PRIVATE_KEY=your_private_key_here

# Basescan API key for contract verification
BASESCAN_API_KEY=your_basescan_api_key_here
```

After deployment, add this to your main project `.env`:

```env
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=deployed_contract_address_here
```

## How to get these values:

1. **PRIVATE_KEY**: Export from MetaMask or your wallet (Settings > Security & Privacy > Reveal Private Key)
   - ⚠️ NEVER share this or commit it to git
   
2. **BASESCAN_API_KEY**: Get from https://basescan.org/myapikey
   - Sign up for a free account
   - Create a new API key

3. **NFT_CONTRACT_ADDRESS**: This will be provided after deployment


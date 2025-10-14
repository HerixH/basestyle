import { ethers } from "hardhat";

async function main() {
  console.log("Deploying AppreciationNFT contract...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  // Deploy the contract
  const AppreciationNFT = await ethers.getContractFactory("AppreciationNFT");
  const appreciationNFT = await AppreciationNFT.deploy();

  await appreciationNFT.waitForDeployment();

  const contractAddress = await appreciationNFT.getAddress();
  console.log("AppreciationNFT deployed to:", contractAddress);

  // Wait for a few block confirmations
  console.log("Waiting for block confirmations...");
  await appreciationNFT.deploymentTransaction()?.wait(5);

  console.log("\n✅ Deployment complete!");
  console.log("\nNext steps:");
  console.log("1. Add this address to your .env file:");
  console.log(`   NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=${contractAddress}`);
  console.log("\n2. Verify the contract on Basescan:");
  console.log(`   npx hardhat verify --network base ${contractAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


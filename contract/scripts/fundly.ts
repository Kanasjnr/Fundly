import { ethers, network } from "hardhat";
import { verify } from "../utils/verify";

async function main() {
  console.log(`Starting deployment to ${network.name}...`);
  
  // Get the current gas price with network-specific safety margins
  const provider = ethers.provider;
  const gasPrice = await provider.getFeeData();
  
  // Adjust gas price based on network
  let gasPriceMultiplier = BigInt(120); // Default 20% increase
  if (network.name === "mainnet") {
    gasPriceMultiplier = BigInt(120); // 20% increase for mainnet
  } else if (network.name === "crossFi") {
    gasPriceMultiplier = BigInt(110); // 10% increase for crossFi
  } else {
    gasPriceMultiplier = BigInt(105); // 5% increase for other networks
  }

  const increasedGasPrice = gasPrice.maxFeePerGas 
    ? gasPrice.maxFeePerGas * gasPriceMultiplier / BigInt(100)
    : (gasPrice.gasPrice || BigInt(0)) * gasPriceMultiplier / BigInt(100);

  console.log(`Network: ${network.name}`);
  console.log(`Using gas price: ${ethers.formatUnits(increasedGasPrice, 'gwei')} gwei`);

  // Network-specific deployment settings
  const confirmations = network.name === "mainnet" ? 5 : 2;
  console.log(`Using ${confirmations} block confirmations for this network`);

  // Deploy KYCManager
  console.log("Deploying KYCManager...");
  const KYCManager = await ethers.getContractFactory("KYCManager");
  const kycManager = await KYCManager.deploy({
    maxFeePerGas: increasedGasPrice,
    maxPriorityFeePerGas: gasPrice.maxPriorityFeePerGas || undefined
  } as any);
  
  const kycManagerAddress = await kycManager.getAddress();
  console.log("KYCManager deployed to:", kycManagerAddress);
  
  // Wait for confirmations based on network
  console.log(`Waiting for KYCManager deployment confirmation (${confirmations} blocks)...`);
  await kycManager.deploymentTransaction()?.wait(confirmations);

  // Set initial quorum votes (e.g., 5 tokens in wei)
  const initialQuorumVotes = ethers.parseEther("5");

  // Deploy Fundly
  console.log("Deploying Fundly...");
  const Fundly = await ethers.getContractFactory("Fundly");
  const fundly = await Fundly.deploy(
    kycManagerAddress,
    initialQuorumVotes,
    {
      maxFeePerGas: increasedGasPrice,
      maxPriorityFeePerGas: gasPrice.maxPriorityFeePerGas || undefined
    } as any
  );
  
  const fundlyAddress = await fundly.getAddress();
  console.log("Fundly deployed to:", fundlyAddress);

  // Wait for confirmations based on network
  console.log(`Waiting for Fundly deployment confirmation (${confirmations} blocks)...`);
  await fundly.deploymentTransaction()?.wait(confirmations);

  // Verify contracts on Etherscan (if supported by network)
  if (network.name !== "hardhat" && network.name !== "localhost") {
    console.log("Verifying contracts on Etherscan...");
    try {
      await verify(kycManagerAddress, []);
      await verify(fundlyAddress, [kycManagerAddress, initialQuorumVotes]);
      console.log("Contract verification completed successfully!");
    } catch (error) {
      console.error("Contract verification failed:", error);
    }
  }

  // Final deployment checks
  console.log("\nDeployment Summary:");
  console.log("-------------------");
  console.log("Network:", network.name);
  console.log("KYCManager:", kycManagerAddress);
  console.log("Fundly:", fundlyAddress);
  console.log("Initial Quorum Votes:", ethers.formatEther(initialQuorumVotes), "tokens");
  console.log("\nDeployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
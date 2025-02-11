import { ethers } from "hardhat";

async function main() {
  // Get the current gas price and increase it
  const provider = ethers.provider;
  const gasPrice = await provider.getFeeData();
  const increasedGasPrice = gasPrice.maxFeePerGas 
    ? gasPrice.maxFeePerGas * BigInt(2) 
    : (gasPrice.gasPrice || BigInt(0)) * BigInt(2);

  console.log(`Using gas price: ${ethers.formatUnits(increasedGasPrice, 'gwei')} gwei`);

  // Deploy KYCManager
  const KYCManager = await ethers.getContractFactory("KYCManager");
  const kycManager = await KYCManager.deploy({
    maxFeePerGas: increasedGasPrice,
    maxPriorityFeePerGas: gasPrice.maxPriorityFeePerGas
  });
  await kycManager.waitForDeployment();
  console.log("KYCManager deployed to:", await kycManager.getAddress());

  // Set initial quorum votes (e.g., 5 tokens in wei)
  const initialQuorumVotes = ethers.parseEther("5");

  // Deploy Fundly
  const Fundly = await ethers.getContractFactory("Fundly");
  const fundly = await Fundly.deploy(
    await kycManager.getAddress(), 
    initialQuorumVotes,
    {
      maxFeePerGas: increasedGasPrice,
      maxPriorityFeePerGas: gasPrice.maxPriorityFeePerGas
    }
  );
  await fundly.waitForDeployment();
  console.log("Fundly deployed to:", await fundly.getAddress());

  console.log("Waiting for block confirmations...");
  await kycManager.deploymentTransaction()?.wait(5);
  await fundly.deploymentTransaction()?.wait(5);

  console.log("Deployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const gasSettings = await ethers.provider.getFeeData();

  console.log("Deploying with account:", deployer.address);
  console.log("Suggested maxFeePerGas:", gasSettings.maxFeePerGas.toString());
  console.log("Suggested maxPriorityFeePerGas:", gasSettings.maxPriorityFeePerGas.toString());

  const fundly = await ethers.deployContract("Fundly", {
    maxPriorityFeePerGas: gasSettings.maxPriorityFeePerGas,
    maxFeePerGas: gasSettings.maxFeePerGas,
  });

  await fundly.waitForDeployment();

  console.log("Fundly Contract Deployed at", fundly.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

const hre = require("hardhat");

async function main() {
  const fundly = await hre.ethers.deployContract("Fundly");

  await fundly.waitForDeployment();

  console.log("Fundly Contract Deployed at " + fundly.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

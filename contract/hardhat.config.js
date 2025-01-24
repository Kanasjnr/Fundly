require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.26",
  networks: {
    crossFi: {
      url: process.env.CROSSFI_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      gasPrice: 1000000000, // You can replace this with dynamic gas fees in the deployment script
    },
  },
};

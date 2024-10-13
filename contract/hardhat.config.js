require("@nomiclabs/hardhat-ethers");
require("@nomicfoundation/hardhat-toolbox");

require("dotenv").config();

const { PRIVATE_KEY } = process.env;

module.exports = {
  solidity: "0.8.26",
  networks: {
    hardhat: {},

    "lisk-sepolia": {
      url: `https://rpc.sepolia-api.lisk.com`,
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
};

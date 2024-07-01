require("@matterlabs/hardhat-zksync-solc");
require("dotenv").config();

require("@nomiclabs/hardhat-ethers");

const { PRIVATE_KEY } = process.env;

module.exports = {
	solidity: "0.8.11",
	networks: {
		hardhat: {},

      "Sepolia": {
			url: "https://ethereum-sepolia.publicnode.com",
			accounts: [`0x${PRIVATE_KEY}`],
			gasPrice: 1000000000,
			chainId: 11155111,
		},
	},

	
	sourcify: {
		enabled: false,
	},
};
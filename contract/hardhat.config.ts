import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

require("dotenv").config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.26",
    settings: {
      optimizer: {
        enabled: true, 
        runs: 200, 
      },
    },
  },
  networks: {
    crossFi: {
      url: process.env.CROSSFI_RPC_URL || "https://rpc.mainnet.ms",
      accounts: [process.env.PRIVATE_KEY as string],
      chainId: 4158,
    },
  },
};

export default config;
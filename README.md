# Fundly: Web3-Powered Crowdfunding


Fundly is a cutting-edge, Web3-powered crowdfunding platform that empowers creators and entrepreneurs to launch campaigns, gather support, and receive funds securely through blockchain technology. By leveraging decentralized finance (DeFi), Fundly provides transparency, traceability, and verifiable ownership of contributions.

## Features

- **Blockchain-Based Campaigns**: Create and manage fundraising campaigns on the blockchain.
- **Smart Contract Integration**: Automated and transparent fund distribution using smart contracts.
- **Cryptocurrency Payments**: Accept contributions in various cryptocurrencies.
- **Decentralized Identity (DID)**: Implement KYC measures to verify campaign creators, ensuring accountability.
- **Token-Gated Perks**: Offer exclusive rewards to backers through NFTs or tokens.
- **Transparent Tracking**: Real-time, on-chain tracking of campaign progress and fund allocation.
- **Cross-Chain Compatibility**: Support for multiple blockchain networks to maximize reach.
- **Decentralized Governance**: Community voting on platform upgrades and feature additions.

## Getting Started

To get started with Fundly, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/Kanasjnr/Fundly.git
   ```

2. Install dependencies:
   ```
   cd fundly
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the necessary environment variables. Refer to `.env.example` for the required variables, including blockchain network configurations.

4. Run the development server:
   ```
   npm run dev
   ```

5. Open `http://localhost:3000` in your browser to see the application.

## Tech Stack

- **Frontend**: React.js 
- **Smart Contracts**: Solidity
- **Blockchain Interaction**: ethers.js
- **Identity Management**: Ceramic Network
- **IPFS Integration**: For decentralized storage of campaign details
- **Backend**: Node.js with Express (for off-chain operations)
- **Database**: MongoDB (for caching and indexing)
- **Deployment**: Vercel (frontend) & Base sepolia (smart contracts)

## Smart Contracts

Our core smart contracts are located in the `contracts/` directory. Key contracts include:

- `FundlyCampaign.sol`: Manages individual campaign logic and fund distribution.
- `FundlyFactory.sol`: Deploys new campaign contracts and manages global platform settings.
- `FundlyToken.sol`: ERC20 token for platform governance and rewards.

To compile and deploy contracts:

```
npx hardhat compile
npx hardhat deploy --network <network-name>
```

## Contributing

We welcome contributions to Fundly! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, the process for submitting pull requests, and how to set up the development environment.

## Security

Security is paramount in Web3 applications. If you discover any security issues, please email fundly101@gmail.com instead of using the issue tracker.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Support

If you encounter any issues or have questions, please file an issue on the GitHub repository or contact our support team at fundly101@gmail.com.



Empowering decentralized fundraising with Fundly 🚀
import React, { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";
import { useToast } from "@chakra-ui/react";
import {
  contractAbi,
  contractAddress,
  desiredNetworkId,
} from "../utils/constants";

const StateContext = createContext();

export function StateContextProvider({ children }) {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [currentAccount, setCurrentAccount] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const init = async () => {
      try {
        const ethereumProvider = await detectEthereumProvider();
        if (ethereumProvider) {
          const ethersProvider = new ethers.providers.Web3Provider(
            ethereumProvider
          );
          setProvider(ethersProvider);

          const accounts = await ethersProvider.listAccounts();
          if (accounts.length > 0) {
            const signer = ethersProvider.getSigner();
            setSigner(signer);
            setCurrentAccount(accounts[0]);
            await initializeContract(signer);
            await checkNetwork(ethersProvider); // Check the network after initialization
          }

          // Listen for network changes
          ethereumProvider.on("chainChanged", async (chainId) => {
            console.log(`Network changed to ${chainId}`);
            await checkNetwork(ethersProvider); // Recheck network
            toast({
              title: "Network Changed",
              description:
                "The network has changed. Please verify you are on the correct network.",
              status: "warning",
              duration: 5000,
              isClosable: true,
            });
          });
        } else {
          toast({
            title: "MetaMask Not Found",
            description: "Please install MetaMask and try again.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      } catch (err) {
        console.error("Failed to initialize provider:", err);
        toast({
          title: "Initialization Error",
          description:
            "Failed to initialize the provider. Please refresh and try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    init();
  }, [toast]);

  const initializeContract = async (signerOrProvider) => {
    try {
      if (!contractAbi) {
        throw new Error("Contract ABI is undefined");
      }
      const contractInstance = new ethers.Contract(
        contractAddress,
        contractAbi,
        signerOrProvider
      );
      setContract(contractInstance);
    } catch (error) {
      console.error("Failed to initialize contract:", error);
      toast({
        title: "Contract Initialization Error",
        description:
          "Failed to initialize the contract. Please check the ABI and try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const checkNetwork = async (provider) => {
    const { chainId } = await provider.getNetwork();
    if (chainId !== desiredNetworkId) {
      // Check if the network is the desired one
      toast({
        title: "Network Mismatch",
        description: `Please switch to the correct network (Network ID: ${desiredNetworkId}).`,
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const connectWallet = async () => {
    try {
      if (!provider) {
        throw new Error(
          "MetaMask is not installed. Please install MetaMask and try again."
        );
      }

      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      setSigner(signer);

      const address = await signer.getAddress();
      setCurrentAccount(address);

      await initializeContract(signer);
      await checkNetwork(provider); // Check the network after connecting the wallet

      toast({
        title: "Wallet Connected",
        description: `Successfully connected to wallet: ${address}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      toast({
        title: "Connection Error",
        description:
          error.message || "Failed to connect wallet. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const createCampaign = async (form) => {
    try {
      if (!contract) {
        throw new Error(
          "Contract not initialized. Please connect your wallet first."
        );
      }

      const data = await contract.createCampaign(
        currentAccount,
        form.title,
        form.description,
        form.target,
        new Date(form.deadline).getTime(),
        form.image
      );

      await data.wait();
      toast({
        title: "Campaign Created",
        description: "Your campaign has been created successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Failed to create campaign:", error);
      toast({
        title: "Campaign Creation Error",
        description:
          error.message || "Failed to create campaign. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const getCampaigns = async () => {
    try {
      if (!contract) throw new Error("Contract not initialized");

      const campaigns = await contract.getCampaigns();
      console.log({ campaigns });
      return campaigns.map((campaign, i) => ({
        owner: campaign.owner,
        title: campaign.title,
        description: campaign.description,
        target: ethers.utils.formatEther(campaign.target),
        deadline: campaign.deadline.toNumber(),
        amountCollected: ethers.utils.formatEther(campaign.amountCollected),
        image: campaign.image,
        paidOut: campaign.paidOut,
        pId: i,
      }));
    } catch (error) {
      console.error("Failed to get campaigns:", error);
      return [];
    }
  };

  const getUserCampaigns = async () => {
    try {
      const allCampaigns = await getCampaigns();
      return allCampaigns.filter(
        (campaign) => campaign.owner === currentAccount
      );
    } catch (error) {
      console.error("Failed to get user campaigns:", error);
      return [];
    }
  };

  const donate = async (pId, amount) => {
    try {
      if (!contract) throw new Error("Contract not initialized");

      const tx = await contract.donateCampaign(pId, {
        value: ethers.utils.parseEther(amount),
      });

      await tx.wait();
      toast({
        title: "Donation Successful",
        description: `You have successfully donated ${amount} ETH to the campaign.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Failed to donate:", error);
      toast({
        title: "Donation Error",
        description: error.message || "Failed to donate. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const getDonations = async (pId) => {
    try {
      if (!contract) throw new Error("Contract not initialized");

      const [donators, donations] = await contract.getDonators(pId);

      return donators.map((donator, index) => ({
        donator,
        donation: ethers.utils.formatEther(donations[index]),
      }));
    } catch (error) {
      console.error("Failed to get donations:", error);
      return [];
    }
  };

  const payout = async (pId) => {
    try {
      if (!contract) throw new Error("Contract not initialized");

      const tx = await contract.payout(pId);
      await tx.wait();
      await getCampaigns();

      toast({
        title: "Payout Successful",
        description: "The payout has been processed successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Failed to payout:", error);
      toast({
        title: "Payout Error",
        description: error.message || "Failed to payout. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  const submitVerificationDocument = async (documentHash, nameHash) => {
    try {
      // const contract = await getContract();
      const transaction = await contract.submitVerificationDocument(
        documentHash,
        nameHash
      );
      await transaction.wait();
    } catch (error) {
      console.error("Error submitting verification document:", error);
      throw error;
    }
  };

  const getUserVerificationStatus = async (address) => {
    try {
      // const contract = await getContract();
      const status = await contract.getUserVerificationStatus(address);
      return status;
    } catch (error) {
      console.error("Error getting user verification status:", error);
      throw error;
    }
  };

  const getVerificationRequests = async (contract) => {
    try {
      if (!contract || !(contract instanceof ethers.Contract)) {
        throw new Error("Contract is not properly initialized");
      }

      if (!contract.getPendingVerificationRequests) {
        throw new Error(
          "getPendingVerificationRequests method is not available on the contract"
        );
      }

      const requests = await contract.getPendingVerificationRequests();
      return requests;
    } catch (error) {
      console.error("Error getting verification requests:", error);
      throw error;
    }
  };

  const approveVerification = async (address) => {
    try {
      const transaction = await contract.approveVerification(address);
      await transaction.wait();
    } catch (error) {
      console.error("Error approving verification:", error);
      throw error;
    }
  };

  const rejectVerification = async (address) => {
    try {
      // const contract = await getContract();
      const transaction = await contract.rejectVerification(address);
      await transaction.wait();
    } catch (error) {
      console.error("Error rejecting verification:", error);
      throw error;
    }
  };
  return (
    <StateContext.Provider
      value={{
        connectWallet,
        createCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        contract,
        getDonations,
        payout,
        submitVerificationDocument,
        getUserVerificationStatus,
        getVerificationRequests,
        approveVerification,
        rejectVerification,
        currentAccount,
      }}
    >
      {children}
    </StateContext.Provider>
  );
}

export const useStateContext = () => useContext(StateContext);

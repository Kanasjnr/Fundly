import React, { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";
import { useToast } from "@chakra-ui/react";
import { contractAbi, contractAddress } from "../utils/constants";

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
          }
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

  const publishCampaign = async (form) => {
    try {
      if (!contract) {
        throw new Error(
          "Contract not initialized. Please connect your wallet first."
        );
      }

      // const targetAmount =
      //   typeof form.target === "string" ? form.target : form.target.toString();

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
    const data = await contract.donateCampaign([pId], {
      value: ethers.utils.parseEther(amount),
    });

    return data;
  };

  const getDonations = async (pId) => {
    const donations = await contract.getDonators([pId]);
    const numberOfDonations = donations[0].length;

    const parsedDonations = [];

    for (let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donations: ethers.utils.formatEther(donations[1][i].toString()),
      });
    }

    return parsedDonations;
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

  return (
    <StateContext.Provider
      value={{
        connectWallet,
        currentAccount,
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        payout,
        getDonations,
        contract,
      }}
    >
      {children}
    </StateContext.Provider>
  );
}

export const useStateContext = () => useContext(StateContext);

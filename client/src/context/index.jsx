import React, { useContext, createContext } from "react";
import {
  useAddress,
  useContract,
  useLogout,
  useMetamask,
  useContractWrite,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract(
    "0xa3d564A3dff633Dd1d5810d36E2E02c3F4954431"
  );
  const { mutateAsync: createCampaign } = useContractWrite(
    contract,
    "createCampaign"
  );

  const address = useAddress();
  const connect = useMetamask();
  const logout = useLogout();

  const publishCampaign = async (form) => {
    if (!contract) {
      console.error("Contract instance is undefined");
      return;
    }
    try {
      const data = await createCampaign({
        args: [
          address,
          form.title,
          form.description,
          form.target,
          new Date(form.deadline).getTime(),
          form.image,
        ],
      });

      console.log("Contract call success", data);
    } catch (error) {
      console.error("Contract call failure", error);
    }
  };

  const getCampaigns = async () => {
    if (!contract) {
      console.error("Contract instance is undefined");
      return [];
    }
    try {
      const campaigns = await contract.call("getCampaigns");

      const parsedCampaigns = campaigns.map((campaign, i) => ({
        owner: campaign.owner,
        title: campaign.title,
        description: campaign.description,
        target: ethers.utils.formatEther(campaign.target.toString()),
        deadline: campaign.deadline.toNumber(),
        amountCollected: ethers.utils.formatEther(
          campaign.amountCollected.toString()
        ),
        image: campaign.image,
        pId: i,
      }));

      return parsedCampaigns;
    } catch (error) {
      console.error("Error fetching campaigns", error);
      return [];
    }
  };

  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();
    return allCampaigns.filter((campaign) => campaign.owner === address);
  };

  const donate = async (amount) => {
    try {
        await contract.call("donateToCampaign", [amount]);
        console.log("Donation successful");
    } catch (error) {
        console.error("Error donating to campaign", error);
    }
};

  const getDonations = async (pId) => {
    if (!contract) {
      console.error("Contract instance is undefined");
      return [];
    }
    try {
      const donations = await contract.call("getDonators", [pId]);
      const numberOfDonations = donations[0].length;

      const parsedDonations = [];
      for (let i = 0; i < numberOfDonations; i++) {
        parsedDonations.push({
          donator: donations[0][i],
          donation: ethers.utils.formatEther(donations[1][i].toString()),
        });
      }

      return parsedDonations;
    } catch (error) {
      console.error("Error fetching donations", error);
      return [];
    }
  };

  const transferDonationsToOwner = async (pId) => {
    if (!contract) {
      console.error("Contract instance is undefined");
      return;
    }
    try {
      const data = await contract.call("transferDonationsToOwner", [pId]);
      console.log("Transfer success", data);
    } catch (error) {
      console.error("Transfer failed", error);
    }
  };

  const endCampaign = async (pId) => {
    if (!contract) {
      console.error("Contract instance is undefined");
      return;
    }
    try {
      const data = await contract.call("endCampaign", [pId]);
      console.log("End campaign success", data);
    } catch (error) {
      console.error("End campaign failure", error);
    }
  };



  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connect,
        logout,
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
        transferDonationsToOwner,
        endCampaign,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);

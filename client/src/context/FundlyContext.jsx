import { createContext, useState, useEffect, useCallback } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import useContract from "../hooks/useContract";
import FundlyABI from "../abis/Fundly.json";
import { toast } from "react-toastify";

const FundlyContext = createContext();

export const useFundly = () => {
  const context = useContext(FundlyContext);
  if (!context) {
    throw new Error("useFundly must be used within a FundlyProvider");
  }
  return context;
};

export const FundlyProvider = ({ children }) => {
  const [state, setState] = useState({
    campaigns: [],
    userCampaigns: [],
    loading: true,
  });

  const { address } = useAppKitAccount();
  const fundlyAddress = import.meta.env.VITE_APP_FUNDLY_CONTRACT_ADDRESS;
  const { contract } = useContract(fundlyAddress, FundlyABI);

  const fetchCampaigns = useCallback(async () => {
    if (!contract) return;
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const campaignsData = await contract.getCampaigns();
      setState((prev) => ({ ...prev, campaigns: campaignsData, loading: false }));
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, [contract]);

  const fetchUserCampaigns = useCallback(async () => {
    if (!contract || !address) return;
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const userCampaignsData = await contract.getCampaignsByOwner(address);
      setState((prev) => ({ ...prev, userCampaigns: userCampaignsData, loading: false }));
    } catch (error) {
      console.error("Error fetching user campaigns:", error);
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, [contract, address]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  useEffect(() => {
    if (address) {
      fetchUserCampaigns();
    }
  }, [fetchUserCampaigns, address]);

  const value = {
    ...state,
    fetchCampaigns,
    fetchUserCampaigns,
  };

  return <FundlyContext.Provider value={value}>{children}</FundlyContext.Provider>;
};

export default FundlyProvider;
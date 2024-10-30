import React, { useState, useEffect } from "react";

import DisplayCampaigns from "./Campaigns/DisplayCampaigns";
import { useStateContext } from "../context";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);

  const { currentAccount, contract, getCampaigns } = useStateContext();
  
  const fetchCampaigns = async() => {
    setIsLoading(true);
    const data = await getCampaigns();
    setCampaigns(data);
    setIsLoading(false);
  }

  useEffect(() => {
    console.log({contract})
    if(contract) fetchCampaigns();
  }, [currentAccount, contract]);

  return(
    <DisplayCampaigns
        title="All Campaigns"
        isLoading= {isLoading}
        campaigns = {campaigns}
    />
  );
};

export default Dashboard;
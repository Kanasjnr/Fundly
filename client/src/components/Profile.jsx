import React, { useState, useEffect } from 'react';
import DisplayCampaigns from "./Campaigns/DisplayCampaigns"
import { useStateContext } from '../context';
import { calculateBarPercentage } from '../utils';

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [completedCampaigns, setCompletedCampaigns] = useState([]);
  const [ongoingCampaigns, setOngoingCampaigns] = useState([]);
  const [canceledCampaigns, setCanceledCampaigns] = useState([]);

  const { address, contract, getUserCampaigns } = useStateContext();

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getUserCampaigns();
    
    const completed = [];
    const ongoing = [];
    const canceled = [];
    
    // Iterate over each campaign data
    data.forEach(campaign => {
      const { goal, amountCollected } = campaign;
      
      // Use calculateBarPercentage function to determine the status
      const { status } = calculateBarPercentage(goal, amountCollected);
      
      // Categorize the campaign based on its status
      if (status === 'completed') {
        completed.push({ ...campaign, completed: true });
      } else if (status === 'ongoing') {
        ongoing.push({ ...campaign, completed: false });
      } else {
        canceled.push({ ...campaign, completed: false });
      }
    });
    
    setCompletedCampaigns(completed);
    setOngoingCampaigns(ongoing);
    setCanceledCampaigns(canceled);
    
    setIsLoading(false);
  }

  useEffect(() => {
    if(contract) fetchCampaigns();
  }, [address, contract]);

  return (
    <>
      <DisplayCampaigns 
        title="Completed Campaigns"
        isLoading={isLoading}
        campaigns={completedCampaigns}
      />
      <DisplayCampaigns 
        title="Ongoing Campaigns"
        isLoading={isLoading}
        campaigns={ongoingCampaigns}
      />
      <DisplayCampaigns 
        title="Canceled Campaigns"
        isLoading={isLoading}
        campaigns={canceledCampaigns}
      />
    </>
  );
}

export default Profile;
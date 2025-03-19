"use client"

import { useState, useCallback } from "react"
import { toast } from "react-toastify"
import { ethers } from "ethers"
import useContract from "../useContract"
import FundlyABI from "../../abis/Fundly.json"

const useGetAllCampaigns = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const fundlyAddress = import.meta.env.VITE_APP_FUNDLY_CONTRACT_ADDRESS
  const { contract } = useContract(fundlyAddress, FundlyABI)

  const getAllCampaigns = useCallback(async () => {
    if (!contract) {
      // toast.error("Contract is not available")
      return null
    }

    setLoading(true)
    setError(null)

    try {
      const campaigns = await contract.getAllCampaigns()
      return campaigns.map((campaign, index) => ({
        id: index,
        owner: campaign.owner,
        title: campaign.title,
        description: campaign.description,
        target: ethers.formatEther(campaign.target),
        deadline: Number(campaign.deadline),
        amountCollected: ethers.formatEther(campaign.amountCollected),
        image: campaign.image,
        donators: campaign.donators,
        donations: campaign.donations.map((d) => ethers.formatEther(d)),
        paidOut: campaign.paidOut,
        milestones: campaign.milestones.map((m) => ethers.formatEther(m)),
        currentMilestone: Number(campaign.currentMilestone),
        status: Number(campaign.status),
        statusText: ["Active", "Successful", "Failed", "Paid"][Number(campaign.status)],
        createdAt: Number(campaign.createdAt),
      }))
    } catch (err) {
      console.error("Error fetching campaigns:", err)
      setError("Error fetching campaigns: " + (err.message || "Unknown error"))
      toast.error(`Error: ${err.message || "An unknown error occurred."}`)
      return null
    } finally {
      setLoading(false)
    }
  }, [contract])

  return { getAllCampaigns, loading, error }
}

export default useGetAllCampaigns


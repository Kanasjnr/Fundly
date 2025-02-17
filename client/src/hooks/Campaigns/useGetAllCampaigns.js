"use client"

import { useState, useCallback } from "react"
import { toast } from "react-toastify"
import useContract from "../useContract"
import FundlyABI from "../../abis/Fundly.json"

const useGetAllCampaigns = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const fundlyAddress = import.meta.env.VITE_APP_FUNDLY_CONTRACT_ADDRESS
  const { contract } = useContract(fundlyAddress, FundlyABI)

  const getAllCampaigns = useCallback(
    async () => {
      if (!contract) {
        toast.error("Contract is not available")
        return null
      }

      setLoading(true)
      setError(null)

      try {
        const campaigns = await contract.getAllCampaigns()
        return campaigns.map((campaign) => ({
          owner: campaign.owner,
          title: campaign.title,
          description: campaign.description,
          target: campaign.target,
          deadline: campaign.deadline,
          amountCollected: campaign.amountCollected,
          image: campaign.image,
          donators: campaign.donators,
          donations: campaign.donations,
          paidOut: campaign.paidOut,
          milestones: campaign.milestones,
          currentMilestone: campaign.currentMilestone,
          status: campaign.status,
        }))
      } catch (err) {
        console.error("Error fetching campaigns:", err)
        setError("Error fetching campaigns: " + (err.message || "Unknown error"))
        toast.error(`Error: ${err.message || "An unknown error occurred."}`)
        return null
      } finally {
        setLoading(false)
      }
    },
    [contract],
  )

  return { getAllCampaigns, loading, error }
}

export default useGetAllCampaigns
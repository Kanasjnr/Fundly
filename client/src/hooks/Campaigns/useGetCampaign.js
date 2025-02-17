"use client"

import { useState, useCallback } from "react"
import { toast } from "react-toastify"
import useContract from "../useContract"
import FundlyABI from "../../abis/Fundly.json"

const useGetCampaign = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const fundlyAddress = import.meta.env.VITE_APP_FUNDLY_CONTRACT_ADDRESS
  const { contract } = useContract(fundlyAddress, FundlyABI)

  const getCampaign = useCallback(
    async (campaignId) => {
      if (!contract) {
        toast.error("Contract is not available")
        return null
      }

      setLoading(true)
      setError(null)

      try {
        const campaignData = await contract.getCampaign(campaignId)
        return {
          owner: campaignData[0],
          title: campaignData[1],
          description: campaignData[2],
          target: campaignData[3],
          deadline: campaignData[4],
          amountCollected: campaignData[5],
          image: campaignData[6],
          donators: campaignData[7],
          donations: campaignData[8],
          paidOut: campaignData[9],
          milestones: campaignData[10],
          currentMilestone: campaignData[11],
          status: campaignData[12], // Added status field
        }
      } catch (err) {
        console.error("Error fetching campaign:", err)
        setError("Error fetching campaign: " + (err.message || "Unknown error"))
        toast.error(`Error: ${err.message || "An unknown error occurred."}`)
        return null
      } finally {
        setLoading(false)
      }
    },
    [contract],
  )

  return { getCampaign, loading, error }
}

export default useGetCampaign
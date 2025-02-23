"use client"

import { useState, useCallback } from "react"
import { toast } from "react-toastify"
import useContract from "../useContract"
import FundlyABI from "../../abis/Fundly.json"

const useGetCampaignAnalytics = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const fundlyAddress = import.meta.env.VITE_APP_FUNDLY_CONTRACT_ADDRESS
  const { contract } = useContract(fundlyAddress, FundlyABI)

  const getCampaignAnalytics = useCallback(
    async (campaignId) => {
      if (!contract) {
        toast.error("Contract is not available")
        return null
      }

      setLoading(true)
      setError(null)

      try {
        const analytics = await contract.getCampaignAnalytics(campaignId)
        return {
          totalBackers: analytics[0].toNumber(),
          fundingProgress: analytics[1].toNumber(),
          timeRemaining: analytics[2].toNumber(),
          currentMilestone: analytics[3].toNumber(),
        }
      } catch (err) {
        console.error("Error fetching campaign analytics:", err)
        setError("Error fetching campaign analytics: " + (err.message || "Unknown error"))
        toast.error(`Error: ${err.message || "An unknown error occurred."}`)
        return null
      } finally {
        setLoading(false)
      }
    },
    [contract],
  )

  return { getCampaignAnalytics, loading, error }
}

export default useGetCampaignAnalytics
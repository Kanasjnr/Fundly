"use client"

import { useState, useCallback } from "react"
import { toast } from "react-toastify"
import useContract from "../useContract"
import FundlyABI from "../../abis/Fundly.json"

const useGetCampaignStatus = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const fundlyAddress = import.meta.env.VITE_APP_FUNDLY_CONTRACT_ADDRESS
  const { contract } = useContract(fundlyAddress, FundlyABI)

  const getCampaignStatus = useCallback(
    async (campaignId) => {
      if (!contract) {
        // toast.error("Contract is not available")
        return null
      }

      setLoading(true)
      setError(null)

      try {
        // Get the campaign to check its status
        const campaign = await contract.getCampaign(campaignId)
        const status = Number(campaign.status)
        const statusText = ["Active", "Successful", "Failed", "Paid"][status]

        return { status, statusText }
      } catch (err) {
        console.error("Error fetching campaign status:", err)
        setError("Error fetching campaign status: " + (err.message || "Unknown error"))
        toast.error(`Error: ${err.message || "An unknown error occurred."}`)
        return null
      } finally {
        setLoading(false)
      }
    },
    [contract],
  )

  return { getCampaignStatus, loading, error }
}

export default useGetCampaignStatus


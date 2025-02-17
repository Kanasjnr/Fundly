"use client"

import { useState, useCallback } from "react"
import { toast } from "react-toastify"
import useContract from "../useContract"
import FundlyABI from "../../abis/Fundly.json"

const useGetCampaignFundFlow = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const fundlyAddress = import.meta.env.VITE_APP_FUNDLY_CONTRACT_ADDRESS
  const { contract } = useContract(fundlyAddress, FundlyABI)

  const getCampaignFundFlow = useCallback(
    async (campaignId) => {
      if (!contract) {
        toast.error("Contract is not available")
        return null
      }

      setLoading(true)
      setError(null)

      try {
        const fundFlow = await contract.getCampaignFundFlow(campaignId)
        return {
          donations: fundFlow[0],
          milestones: fundFlow[1],
        }
      } catch (err) {
        console.error("Error fetching campaign fund flow:", err)
        setError("Error fetching campaign fund flow: " + (err.message || "Unknown error"))
        toast.error(`Error: ${err.message || "An unknown error occurred."}`)
        return null
      } finally {
        setLoading(false)
      }
    },
    [contract],
  )

  return { getCampaignFundFlow, loading, error }
}

export default useGetCampaignFundFlow
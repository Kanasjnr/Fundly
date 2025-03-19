"use client"

import { useState, useCallback } from "react"
import { toast } from "react-toastify"
import { useAppKitAccount } from "@reown/appkit/react"
import useSignerOrProvider from "../useSignerOrProvider"
import useContract from "../useContract"
import FundlyABI from "../../abis/Fundly.json"

const useUpdateCampaignStatuses = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { address, isConnected } = useAppKitAccount()
  const { signer } = useSignerOrProvider()
  const fundlyAddress = import.meta.env.VITE_APP_FUNDLY_CONTRACT_ADDRESS
  const { contract } = useContract(fundlyAddress, FundlyABI)

  const updateCampaignStatuses = useCallback(
    async (campaignIds) => {
      if (!address || !isConnected) {
        toast.error("Please connect your wallet")
        return { success: false }
      }

      if (!signer || !contract) {
        toast.error("Contract or signer is not available")
        return { success: false }
      }

      if (!Array.isArray(campaignIds) || campaignIds.length === 0) {
        toast.error("Please provide at least one campaign ID")
        return { success: false }
      }

      setLoading(true)
      setError(null)

      try {
        const tx = await contract.updateCampaignStatuses(campaignIds)
        const receipt = await tx.wait()

        if (receipt.status === 1) {
          // Find all CampaignStatusChanged events
          const statusChangedEvents = receipt.events?.filter((e) => e.event === "CampaignStatusChanged") || []
          const updatedCampaigns = statusChangedEvents.map((event) => ({
            campaignId: event.args.campaignId.toString(),
            newStatus: ["Active", "Successful", "Failed", "Paid"][Number(event.args.newStatus)],
          }))

          toast.success(`Updated ${updatedCampaigns.length} campaign statuses!`)
          return { success: true, updatedCampaigns }
        } else {
          throw new Error("Transaction failed")
        }
      } catch (err) {
        console.error("Transaction error:", err)

        // Handle specific contract errors
        if (err.message?.includes("InvalidArrayLength")) {
          setError("Too many campaign IDs. Maximum batch size is 100.")
        } else {
          setError("Error updating campaign statuses: " + (err.message || "Unknown error"))
        }

        toast.error(`Error: ${err.message || "An unknown error occurred."}`)
        return { success: false, error: err.message }
      } finally {
        setLoading(false)
      }
    },
    [address, isConnected, signer, contract],
  )

  return { updateCampaignStatuses, loading, error }
}

export default useUpdateCampaignStatuses


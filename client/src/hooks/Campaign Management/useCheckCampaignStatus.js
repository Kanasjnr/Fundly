"use client"

import { useState, useCallback } from "react"
import { toast } from "react-toastify"
import { useAppKitAccount } from "@reown/appkit/react"
import useSignerOrProvider from "../useSignerOrProvider"
import useContract from "../useContract"
import FundlyABI from "../../abis/Fundly.json"

const useCheckCampaignStatus = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { address, isConnected } = useAppKitAccount()
  const { signer } = useSignerOrProvider()
  const fundlyAddress = import.meta.env.VITE_APP_FUNDLY_CONTRACT_ADDRESS
  const { contract } = useContract(fundlyAddress, FundlyABI)

  const checkCampaignStatus = useCallback(
    async (campaignId) => {
      if (!address || !isConnected) {
        toast.error("Please connect your wallet")
        return { success: false }
      }

      if (!signer || !contract) {
        toast.error("Contract or signer is not available")
        return { success: false }
      }

      setLoading(true)
      setError(null)

      try {
        const tx = await contract.checkCampaignStatus(campaignId)
        const receipt = await tx.wait()

        if (receipt.status === 1) {
          // Check if status was changed by looking for the event
          const statusChangedEvent = receipt.events?.find((e) => e.event === "CampaignStatusChanged")

          if (statusChangedEvent) {
            const newStatus = ["Active", "Successful", "Failed", "Paid"][Number(statusChangedEvent.args.newStatus)]
            toast.success(`Campaign status updated to: ${newStatus}`)
            return { success: true, statusChanged: true, newStatus }
          } else {
            // No status change was needed
            return { success: true, statusChanged: false }
          }
        } else {
          throw new Error("Transaction failed")
        }
      } catch (err) {
        console.error("Transaction error:", err)

        // Handle specific contract errors
        if (err.message?.includes("CampaignNotFound")) {
          setError("Campaign not found")
        } else {
          setError("Error checking campaign status: " + (err.message || "Unknown error"))
        }

        toast.error(`Error: ${err.message || "An unknown error occurred."}`)
        return { success: false, error: err.message }
      } finally {
        setLoading(false)
      }
    },
    [address, isConnected, signer, contract],
  )

  return { checkCampaignStatus, loading, error }
}

export default useCheckCampaignStatus


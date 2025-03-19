"use client"

import { useState, useCallback } from "react"
import { toast } from "react-toastify"
import { useAppKitAccount } from "@reown/appkit/react"
import useSignerOrProvider from "../useSignerOrProvider"
import useContract from "../useContract"
import FundlyABI from "../../abis/Fundly.json"

const useCompleteMilestone = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { address, isConnected } = useAppKitAccount()
  const { signer } = useSignerOrProvider()
  const fundlyAddress = import.meta.env.VITE_APP_FUNDLY_CONTRACT_ADDRESS
  const { contract } = useContract(fundlyAddress, FundlyABI)

  const completeMilestone = useCallback(
    async (campaignId, proof) => {
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
        const tx = await contract.completeMilestone(campaignId, proof)
        const receipt = await tx.wait()

        if (receipt.status === 1) {
          // Find the MilestoneCompleted event
          const event = receipt.events?.find((e) => e.event === "MilestoneCompleted")
          const milestoneIndex = event?.args?.milestoneIndex?.toString()

          toast.success("Milestone completed successfully!")
          return { success: true, milestoneIndex }
        } else {
          throw new Error("Transaction failed")
        }
      } catch (err) {
        console.error("Transaction error:", err)

        // Handle specific contract errors
        if (err.message?.includes("Unauthorized")) {
          setError("Only the campaign owner can complete milestones.")
        } else if (err.message?.includes("InvalidMilestoneCount")) {
          setError("All milestones have already been completed.")
        } else {
          setError("Error completing milestone: " + (err.message || "Unknown error"))
        }

        toast.error(`Error: ${err.message || "An unknown error occurred."}`)
        return { success: false, error: err.message }
      } finally {
        setLoading(false)
      }
    },
    [address, isConnected, signer, contract],
  )

  return { completeMilestone, loading, error }
}

export default useCompleteMilestone


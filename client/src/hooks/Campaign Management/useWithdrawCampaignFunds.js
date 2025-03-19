"use client"

import { useState, useCallback } from "react"
import { toast } from "react-toastify"
import { useAppKitAccount } from "@reown/appkit/react"
import useSignerOrProvider from "../useSignerOrProvider"
import useContract from "../useContract"
import FundlyABI from "../../abis/Fundly.json"
import { ethers } from "ethers"

const useWithdrawCampaignFunds = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { address, isConnected } = useAppKitAccount()
  const { signer } = useSignerOrProvider()
  const fundlyAddress = import.meta.env.VITE_APP_FUNDLY_CONTRACT_ADDRESS
  const { contract } = useContract(fundlyAddress, FundlyABI)

  const withdrawCampaignFunds = useCallback(
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
        const tx = await contract.withdrawCampaignFunds(campaignId)
        const receipt = await tx.wait()

        if (receipt.status === 1) {
          // Find the CampaignPaidOut event to get the amount
          const event = receipt.events?.find((e) => e.event === "CampaignPaidOut")
          const amount = event?.args?.amount

          toast.success("Funds withdrawn successfully!")
          return { success: true, amount: ethers.formatEther(amount) }
        } else {
          throw new Error("Transaction failed")
        }
      } catch (err) {
        console.error("Transaction error:", err)

        // Handle specific contract errors
        if (err.message?.includes("Unauthorized")) {
          setError("Only the campaign owner can withdraw funds.")
        } else if (err.message?.includes("InvalidStatus")) {
          setError("Campaign must be in Successful state to withdraw funds.")
        } else {
          setError("Error withdrawing funds: " + (err.message || "Unknown error"))
        }

        toast.error(`Error: ${err.message || "An unknown error occurred."}`)
        return { success: false, error: err.message }
      } finally {
        setLoading(false)
      }
    },
    [address, isConnected, signer, contract],
  )

  return { withdrawCampaignFunds, loading, error }
}

export default useWithdrawCampaignFunds


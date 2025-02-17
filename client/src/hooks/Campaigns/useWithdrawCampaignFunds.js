"use client"

import { useState, useCallback } from "react"
import { toast } from "react-toastify"
import { useAppKitAccount } from "@reown/appkit/react"
import useSignerOrProvider from "../useSignerOrProvider"
import useContract from "../useContract"
import FundlyABI from "../../abis/Fundly.json"

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
        return false
      }

      if (!signer || !contract) {
        toast.error("Contract or signer is not available")
        return false
      }

      setLoading(true)
      setError(null)

      try {
        const tx = await contract.withdrawCampaignFunds(campaignId)
        const receipt = await tx.wait()

        if (receipt.status === 1) {
          toast.success("Funds withdrawn successfully!")
          return true
        } else {
          throw new Error("Transaction failed")
        }
      } catch (err) {
        console.error("Transaction error:", err)
        setError("Error withdrawing funds: " + (err.message || "Unknown error"))
        toast.error(`Error: ${err.message || "An unknown error occurred."}`)
        return false
      } finally {
        setLoading(false)
      }
    },
    [address, isConnected, signer, contract],
  )

  return { withdrawCampaignFunds, loading, error }
}

export default useWithdrawCampaignFunds
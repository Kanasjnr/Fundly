"use client"

import { useState, useCallback } from "react"
import { toast } from "react-toastify"
import { useAppKitAccount } from "@reown/appkit/react"
import useSignerOrProvider from "../useSignerOrProvider"
import useContract from "../useContract"
import FundlyABI from "../../abis/Fundly.json"

const useVoteOnProposal = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { address, isConnected } = useAppKitAccount()
  const { signer } = useSignerOrProvider()
  const fundlyAddress = import.meta.env.VITE_APP_FUNDLY_CONTRACT_ADDRESS
  const { contract } = useContract(fundlyAddress, FundlyABI)

  const voteOnProposal = useCallback(
    async (proposalId, support) => {
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
        const tx = await contract.voteOnProposal(proposalId, support)
        const receipt = await tx.wait()

        if (receipt.status === 1) {
          toast.success("Vote cast successfully!")
          return true
        } else {
          throw new Error("Transaction failed")
        }
      } catch (err) {
        console.error("Transaction error:", err)
        setError("Error voting on proposal: " + (err.message || "Unknown error"))
        toast.error(`Error: ${err.message || "An unknown error occurred."}`)
        return false
      } finally {
        setLoading(false)
      }
    },
    [address, isConnected, signer, contract],
  )

  return { voteOnProposal, loading, error }
}

export default useVoteOnProposal


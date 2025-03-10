"use client"

import { useState, useCallback } from "react"
import { toast } from "react-toastify"
import { useAppKitAccount } from "@reown/appkit/react"
import useSignerOrProvider from "../useSignerOrProvider"
import useContract from "../useContract"
import FundlyABI from "../../abis/Fundly.json"

const useCreateProposal = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { address, isConnected } = useAppKitAccount()
  const { signer } = useSignerOrProvider()
  const fundlyAddress = import.meta.env.VITE_APP_FUNDLY_CONTRACT_ADDRESS
  const { contract } = useContract(fundlyAddress, FundlyABI)

  const createProposal = useCallback(
    async (campaignId, description, votingPeriod, proposalType) => {
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
        const tx = await contract.createProposal(campaignId, description, votingPeriod, proposalType)

        // Wait for the transaction to be mined and get the receipt
        const receipt = await tx.wait()

        // Check for the ProposalCreated event
        const event = receipt.events?.find((e) => e.event === "ProposalCreated")
        if (!event) {
          throw new Error("Proposal creation event not found")
        }

        toast.success("Proposal created successfully!")
        return true
      } catch (err) {
        console.error("Transaction error:", err)
        setError("Error creating proposal: " + (err.message || "Unknown error"))
        toast.error(`Error: ${err.message || "An unknown error occurred."}`)
        return false
      } finally {
        setLoading(false)
      }
    },
    [address, isConnected, signer, contract],
  )

  return { createProposal, loading, error }
}

export default useCreateProposal


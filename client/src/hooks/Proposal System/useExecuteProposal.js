"use client"

import { useState, useCallback } from "react"
import { toast } from "react-toastify"
import { useAppKitAccount } from "@reown/appkit/react"
import useSignerOrProvider from "../useSignerOrProvider"
import useContract from "../useContract"
import FundlyABI from "../../abis/Fundly.json"

const useExecuteProposal = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { address, isConnected } = useAppKitAccount()
  const { signer } = useSignerOrProvider()
  const fundlyAddress = import.meta.env.VITE_APP_FUNDLY_CONTRACT_ADDRESS
  const { contract } = useContract(fundlyAddress, FundlyABI)

  const executeProposal = useCallback(
    async (proposalId) => {
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
        // First, check if the proposal can be executed
        const proposal = await contract.proposals(proposalId)
        const now = Math.floor(Date.now() / 1000)

        if (!proposal || proposal.id.toString() === "0") {
          throw new Error("Proposal not found")
        }

        if (proposal.executed) {
          throw new Error("Proposal has already been executed")
        }

        if (now <= proposal.endTime) {
          throw new Error("Voting period has not ended yet")
        }

        // Get quorum votes
        const quorumVotes = await contract.quorumVotes()
        if (proposal.totalVotes < quorumVotes) {
          throw new Error("Proposal has not reached quorum")
        }

        if (proposal.forVotes <= proposal.againstVotes) {
          throw new Error("Proposal has not passed")
        }

        // If all checks pass, execute the proposal
        const tx = await contract.executeProposal(proposalId, {
          gasLimit: 500000, // Add a gas limit to prevent unexpected reverts
        })

        const receipt = await tx.wait()

        if (receipt.status === 1) {
          // Find the ProposalExecuted event
          const event = receipt.events?.find((e) => e.event === "ProposalExecuted")
          const success = event?.args?.success

          toast.success("Proposal executed successfully!")
          return { success: true, proposalSuccess: success }
        } else {
          throw new Error("Transaction failed")
        }
      } catch (err) {
        console.error("Transaction error:", err)
        // Extract the revert reason if available
        const revertReason = err.reason || err.message || "Unknown error"
        setError("Error executing proposal: " + revertReason)
        toast.error(`Error: ${revertReason}`)
        return { success: false, error: revertReason }
      } finally {
        setLoading(false)
      }
    },
    [address, isConnected, signer, contract],
  )

  return { executeProposal, loading, error }
}

export default useExecuteProposal


"use client"

import { useState, useCallback } from "react"
import { toast } from "react-toastify"
import useContract from "../useContract"
import FundlyABI from "../../abis/Fundly.json"

const useGetAllProposals = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const fundlyAddress = import.meta.env.VITE_APP_FUNDLY_CONTRACT_ADDRESS
  const { contract } = useContract(fundlyAddress, FundlyABI)

  const getAllProposals = useCallback(async () => {
    if (!contract) {
      toast.error("Contract is not available")
      return null
    }

    setLoading(true)
    setError(null)

    try {
      const proposals = await contract.getAllProposals()
      return proposals.map((proposal) => ({
        id: proposal.id.toNumber(),
        description: proposal.description,
        forVotes: proposal.forVotes.toNumber(),
        againstVotes: proposal.againstVotes.toNumber(),
        executed: proposal.executed,
        endTime: proposal.endTime.toNumber(),
        totalVotes: proposal.totalVotes.toNumber(),
        campaignId: proposal.campaignId.toNumber(),
        proposalType: proposal.proposalType,
        createdAt: proposal.createdAt.toNumber(),
        creator: proposal.creator,
      }))
    } catch (err) {
      console.error("Error fetching proposals:", err)
      setError("Error fetching proposals: " + (err.message || "Unknown error"))
      toast.error(`Error: ${err.message || "An unknown error occurred."}`)
      return null
    } finally {
      setLoading(false)
    }
  }, [contract])

  return { getAllProposals, loading, error }
}

export default useGetAllProposals
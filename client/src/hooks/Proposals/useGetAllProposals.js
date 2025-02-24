"use client"

import { useState, useCallback } from "react"
import { toast } from "react-toastify"
import useContract from "../useContract"
import FundlyABI from "../../abis/Fundly.json"

const useGetAllProposals = () => {
  console.log("Initializing useGetAllProposals hook")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const fundlyAddress = import.meta.env.VITE_APP_FUNDLY_CONTRACT_ADDRESS
  const { contract } = useContract(fundlyAddress, FundlyABI)

  const getAllProposals = useCallback(async () => {
    console.log("Getting all proposals, contract:", contract?.address)

    if (!contract) {
      console.error("Contract not available")
      toast.error("Contract is not available")
      return null
    }

    setLoading(true)
    setError(null)

    try {
      const proposals = await contract.getAllProposals()
      console.log("Raw proposals from contract:", proposals)

      const formattedProposals = proposals.map((proposal) => ({
        id: Number(proposal.id),
        description: proposal.description,
        forVotes: Number(proposal.forVotes),
        againstVotes: Number(proposal.againstVotes),
        executed: proposal.executed,
        endTime: Number(proposal.endTime),
        totalVotes: Number(proposal.totalVotes),
        campaignId: Number(proposal.campaignId),
        proposalType: proposal.proposalType,
        createdAt: Number(proposal.createdAt),
        creator: proposal.creator,
      }))

      console.log("Formatted proposals:", formattedProposals)
      return formattedProposals
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


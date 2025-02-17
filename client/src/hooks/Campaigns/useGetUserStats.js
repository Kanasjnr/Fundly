"use client"

import { useState, useCallback } from "react"
import { toast } from "react-toastify"
import useContract from "../useContract"
import FundlyABI from "../../abis/Fundly.json"

const useGetUserStats = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const fundlyAddress = import.meta.env.VITE_APP_FUNDLY_CONTRACT_ADDRESS
  const { contract } = useContract(fundlyAddress, FundlyABI)

  const getUserStats = useCallback(
    async (userAddress) => {
      if (!contract) {
        toast.error("Contract is not available")
        return null
      }

      setLoading(true)
      setError(null)

      try {
        const userStats = await contract.getUserStats(userAddress)
        return {
          campaignsCreated: userStats.campaignsCreated.toNumber(),
          campaignsBacked: userStats.campaignsBacked.toNumber(),
          proposalsCreated: userStats.proposalsCreated.toNumber(),
          proposalsVoted: userStats.proposalsVoted.toNumber(),
          totalDonated: userStats.totalDonated,
          reputationScore: userStats.reputationScore.toNumber(),
          reputationTier: userStats.reputationTier.toNumber(),
        }
      } catch (err) {
        console.error("Error fetching user stats:", err)
        setError("Error fetching user stats: " + (err.message || "Unknown error"))
        toast.error(`Error: ${err.message || "An unknown error occurred."}`)
        return null
      } finally {
        setLoading(false)
      }
    },
    [contract],
  )

  return { getUserStats, loading, error }
}

export default useGetUserStats


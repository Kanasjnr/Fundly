"use client"

import { useState, useCallback } from "react"
import { toast } from "react-toastify"
import { ethers } from "ethers"
import { useAppKitAccount } from "@reown/appkit/react"
import useSignerOrProvider from "../useSignerOrProvider"
import useContract from "../useContract"
import FundlyABI from "../../abis/Fundly.json"

const useCreateCampaign = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { address, isConnected } = useAppKitAccount()
  const { signer } = useSignerOrProvider()
  const fundlyAddress = import.meta.env.VITE_APP_FUNDLY_CONTRACT_ADDRESS
  const { contract } = useContract(fundlyAddress, FundlyABI)

  const createCampaign = useCallback(
    async (title, description, target, deadline, image, milestones) => {
      if (!address || !isConnected) {
        const message = "Please connect your wallet"
        setError(message)
        toast.error(message)
        return { success: false }
      }

      if (!signer || !contract) {
        const message = "Contract or signer is not available"
        setError(message)
        toast.error(message)
        return { success: false }
      }

      setLoading(true)
      setError(null)

      try {
        // Convert milestones to wei
        const milestonesInWei = milestones.map((milestone) => ethers.parseEther(milestone.toString()))
        
        // Prepare transaction options with explicit gas settings
        const options = {
          gasLimit: 1000000, // Set a higher gas limit to ensure transaction goes through
        }
        
        // Try to estimate gas first to check if the transaction will fail
        try {
          const gasEstimate = await contract.createCampaign.estimateGas(
            title,
            description,
            ethers.parseEther(target.toString()),
            Math.floor(new Date(deadline).getTime() / 1000),
            image,
            milestonesInWei
          )
          
          // Add 20% buffer to gas estimate
          options.gasLimit = Math.floor(gasEstimate.toString() * 1.2)
          console.log("Estimated gas with buffer:", options.gasLimit)
        } catch (estimateError) {
          console.warn("Gas estimation failed, using default limit:", options.gasLimit)
          console.error("Gas estimation error:", estimateError)
          // Continue with default gas limit
        }

        console.log("Sending transaction with options:", options)
        console.log("Transaction data:", {
          title,
          description,
          target: ethers.parseEther(target.toString()),
          deadline: Math.floor(new Date(deadline).getTime() / 1000),
          image,
          milestones: milestonesInWei
        })

        const tx = await contract.createCampaign(
          title,
          description,
          ethers.parseEther(target.toString()),
          Math.floor(new Date(deadline).getTime() / 1000),
          image,
          milestonesInWei,
          options
        )

        console.log("Transaction sent:", tx.hash)
        toast.info("Transaction submitted! Waiting for confirmation...")

        const receipt = await tx.wait()
        console.log("Transaction receipt:", receipt)

        if (receipt.status === 1) {
          // Find the CampaignCreated event to get the campaign ID
          const event = receipt.events?.find((e) => e.event === "CampaignCreated")
          const campaignId = event?.args?.campaignId?.toString()

          toast.success("Campaign created successfully!")
          return { success: true, campaignId }
        } else {
          throw new Error("Transaction failed")
        }
      } catch (err) {
        console.error("Transaction error:", err)

        // Handle gas price errors specifically
        if (err.message?.includes("eth_gasPrice") || err.code === -32603) {
          setError("Network error: Failed to estimate gas price. Please try again later or use a different network.")
          toast.error("Network error: Failed to estimate gas price. Please try again later.")
          return { success: false, error: "Gas price estimation failed" }
        }

        // Handle specific contract errors
        if (err.message?.includes("InvalidAmount")) {
          setError("Target amount is too low. Minimum is 0.1 XFI.")
        } else if (err.message?.includes("DeadlinePassed")) {
          setError("Deadline must be in the future.")
        } else if (err.message?.includes("InvalidDuration")) {
          setError("Campaign duration must be between 1 and 90 days.")
        } else if (err.message?.includes("InvalidMilestoneCount")) {
          setError("Too many milestones. Maximum is 10.")
        } else if (err.message?.includes("InvalidKYC")) {
          setError("You must complete KYC verification first.")
        } else if (err.message?.includes("user rejected")) {
          setError("Transaction was rejected by the user.")
        } else if (err.code === "ACTION_REJECTED") {
          setError("Transaction was rejected by the user.")
        } else if (err.message?.includes("insufficient funds")) {
          setError("Insufficient funds to complete this transaction.")
        } else {
          setError("Error creating campaign: " + (err.message || "Unknown error"))
        }

        toast.error(`Error: ${err.message || "An unknown error occurred."}`)
        return { success: false, error: err.message }
      } finally {
        setLoading(false)
      }
    },
    [address, isConnected, signer, contract],
  )

  return { createCampaign, loading, error }
}

export default useCreateCampaign

"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { Skeleton } from "../components/ui/skeleton";
import { Badge } from "../components/ui/badge";
import { Users, Milestone, Clock, TrendingUp } from "lucide-react";
import useGetCampaign from "../hooks/Campaigns/useGetCampaign";
import { toast } from "react-toastify";
import CampaignDonation from "./CampaignDonation";
import CampaignWithdrawal from "./CampaignWithdrawal";
import { useAppKitAccount } from "@reown/appkit/react";

const CampaignDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getCampaign, loading: hookLoading, error: hookError, isContractReady } = useGetCampaign()
  const [campaign, setCampaign] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { address } = useAppKitAccount()

  useEffect(() => {
    let mounted = true

    const fetchCampaign = async () => {
      if (!id) {
        console.error("Campaign ID is missing or undefined")
        setError("Campaign ID is required")
        setLoading(false)
        return
      }

      if (!isContractReady) {
        console.log("Waiting for contract to be ready...")
        return
      }

      try {
        setLoading(true)
        console.log("Fetching campaign with ID:", id)

        const campaignId = Number.parseInt(id, 10)

        if (isNaN(campaignId)) {
          throw new Error("Invalid campaign ID")
        }

        const result = await getCampaign(campaignId)

        if (!mounted) return

        if (result) {
          console.log("Campaign data received:", result)
          setCampaign(result)
        } else {
          console.log("No campaign data received")
          setError("Failed to fetch campaign data")
        }
      } catch (err) {
        console.error("Error in fetchCampaign:", err)
        if (mounted) {
          const errorMessage = err.message || "An error occurred while fetching the campaign"
          setError(errorMessage)
          toast.error(errorMessage)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchCampaign()

    return () => {
      mounted = false
    }
  }, [id, getCampaign, isContractReady])

  if (!id) {
    return (
      <Card className="p-6">
        <div className="text-center text-destructive">Error: Campaign ID is required</div>
      </Card>
    )
  }

  if (!isContractReady || loading || hookLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="w-full h-64 rounded-lg" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || hookError) {
    const displayError = error || hookError
    return (
      <Card className="p-6">
        <div className="text-center space-y-4">
          <div className="text-destructive">Error: {displayError}</div>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </Card>
    )
  }

  if (!campaign) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">No campaign data available</div>
      </Card>
    )
  }

  const statusColors = {
    Active: "bg-green-500/10 text-green-500",
    Successful: "bg-blue-500/10 text-blue-500",
    Failed: "bg-red-500/10 text-red-500",
    Paid: "bg-purple-500/10 text-purple-500",
  }

  const formatTimeRemaining = (timeInSeconds) => {
    if (timeInSeconds <= 0) return "Ended"
    const days = Math.floor(timeInSeconds / (24 * 60 * 60))
    const hours = Math.floor((timeInSeconds % (24 * 60 * 60)) / (60 * 60))
    return `${days}d ${hours}h remaining`
  }

  const isEnded = campaign.analytics.timeRemaining <= 0
  const isSuccessful = campaign.statusText === "Successful"
  const showDonation = campaign.statusText === "Active"

  // Debug logging
  console.log("Campaign Details State:", {
    isEnded,
    isSuccessful,
    statusText: campaign.statusText,
    timeRemaining: campaign.analytics.timeRemaining,
    paidOut: campaign.paidOut,
    owner: campaign.owner,
    address,
    isOwner: address === campaign.owner,
    fundingProgress: campaign.analytics.fundingProgress,
    target: campaign.target,
    amountCollected: campaign.amountCollected
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{campaign.title}</h1>
        <Badge className={statusColors[campaign.statusText]} variant="outline">
          {campaign.statusText}
        </Badge>
      </div>

      <img
        src={campaign.image || "/placeholder.svg?height=300&width=500"}
        alt={campaign.title}
        className="w-full h-64 object-cover rounded-lg"
      />

      <Card>
        <CardHeader>
          <CardTitle>Campaign Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">{campaign.description}</p>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Target: {campaign.target} XFI</span>
              <span>Raised: {campaign.amountCollected} XFI</span>
            </div>
            <Progress value={campaign.analytics.fundingProgress} className="h-2" />
            <div className="flex justify-end">
              <span className="text-xs text-muted-foreground">{campaign.analytics.fundingProgress}% funded</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>Backers: {campaign.analytics.totalBackers}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{formatTimeRemaining(campaign.analytics.timeRemaining)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Milestone className="h-4 w-4 text-muted-foreground" />
              <span>
                Milestone: {campaign.analytics.currentMilestoneIndex + 1} of {campaign.milestones.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span>Next Milestone: {campaign.milestones[campaign.analytics.currentMilestoneIndex] || "0"} XFI</span>
            </div>
          </div>

          {campaign.donations.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium">Recent Donations</h3>
              <div className="space-y-1">
                {campaign.donations.slice(0, 3).map((donation, index) => (
                  <div key={index} className="text-sm text-muted-foreground">
                    {donation} XFI
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t">
            <div className="text-sm text-muted-foreground break-all">Owner: {campaign.owner}</div>
            <div className="text-sm text-muted-foreground mt-1">
              Status: {campaign.paidOut ? "Funds Released" : "Funds Locked"}
            </div>
          </div>

          <div className="space-y-6">
            {showDonation && (
              <CampaignDonation 
                campaignId={Number(id)} 
                isActive={true} 
                minAmount={0.01} 
              />
            )}

            <CampaignWithdrawal
              campaignId={Number(id)}
              campaignOwner={campaign.owner}
              isEnded={isEnded}
              isSuccessful={isSuccessful}
              isPaidOut={campaign.paidOut}
              amountCollected={campaign.amountCollected}
            />

            <Button className="w-full" onClick={() => navigate(-1)}>
              Back to Campaigns
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CampaignDetails

"use client"
import React from "react";

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Progress } from "../components/ui/progress"
import { Loader2, Filter, ArrowUpDown } from "lucide-react"
import { toast } from "react-toastify"

import useGetCampaign from "../hooks/Campaigns/useGetCampaign";


const CampaignListing = () => {
  const { getAllCampaigns, loading, error } = useGetCampaign()
  const [campaigns, setCampaigns] = useState([])
  const [filteredCampaigns, setFilteredCampaigns] = useState([])
  const navigate = useNavigate()

  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("deadline")

  useEffect(() => {
    const fetchCampaigns = async () => {
      const campaignsData = await getAllCampaigns()
      if (campaignsData) {
        setCampaigns(campaignsData)
        setFilteredCampaigns(campaignsData)
      }
    }

    fetchCampaigns()
  }, [getAllCampaigns])

  useEffect(() => {
    let filtered = [...campaigns] // Create a new array to avoid mutating state directly

    if (statusFilter !== "all") {
      filtered = filtered.filter((campaign) => {
        if (statusFilter === "active") return campaign.statusText === "Active"
        if (statusFilter === "successful") return campaign.statusText === "Successful"
        if (statusFilter === "failed") return campaign.statusText === "Failed"
        return true
      })
    }

    if (sortBy === "deadline") {
      filtered.sort((a, b) => Number(a.deadline) - Number(b.deadline))
    } else if (sortBy === "amountCollected") {
      filtered.sort((a, b) => Number.parseFloat(b.amountCollected) - Number.parseFloat(a.amountCollected))
    } else if (sortBy === "backers") {
      filtered.sort((a, b) => b.analytics.totalBackers - a.analytics.totalBackers)
    }

    setFilteredCampaigns(filtered)
  }, [campaigns, statusFilter, sortBy])

  if (error) {
    toast.error(error)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Campaigns</h1>
        <Button onClick={() => navigate("/dashboard/create-campaign")}>Create Campaign</Button>
      </div>

      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border rounded-lg"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="successful">Successful</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-5 w-5" />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="p-2 border rounded-lg">
            <option value="deadline">Deadline</option>
            <option value="amountCollected">Amount Raised</option>
            <option value="backers">Backers</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign) => (
            <Card
              key={campaign.id}
              className="hover:shadow-lg transition-shadow duration-300 hover:scale-105 cursor-pointer"
            >
              <CardHeader className="relative">
                <img
                  src={campaign.image || "/placeholder.svg"}
                  alt={campaign.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs">
                  {campaign.statusText}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardTitle className="text-xl">{campaign.title}</CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2">{campaign.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Raised</span>
                    <span>
                      {campaign.amountCollected} XFI / {campaign.target} XFI
                    </span>
                  </div>
                  <Progress value={campaign.analytics.fundingProgress} className="h-2" />
                </div>
                <div className="flex justify-between text-sm">
                  <span>Backers</span>
                  <span>{campaign.analytics.totalBackers}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Deadline</span>
                  <span>{new Date(Number(campaign.deadline) * 1000).toLocaleDateString()}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Link to={`/dashboard/campaigns/${campaign.id}`} className="w-full">
                  <Button className="w-full text-sm" variant="default">
                    View Campaign
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {filteredCampaigns.length === 0 && !loading && (
        <div className="text-center text-muted-foreground py-6">No campaigns found.</div>
      )}
    </div>
  )
}

export default CampaignListing



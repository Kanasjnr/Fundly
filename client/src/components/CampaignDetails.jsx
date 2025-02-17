import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Progress } from "../components/ui/progress"

const CampaignDetails = () => {
  const campaign = {
    id: 1,
    title: "Save the Forests",
    description: "Help us plant 1 million trees to combat deforestation and climate change.",
    target: "10 ETH",
    raised: "5 ETH",
    backers: 50,
    deadline: "2023-12-31",
    owner: "0x1234...5678",
    image: "/placeholder.svg?height=300&width=500",
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{campaign.title}</h1>
      <img
        src={campaign.image || "/placeholder.svg"}
        alt={campaign.title}
        className="w-full h-64 object-cover rounded-lg"
      />
      <Card>
        <CardHeader>
          <CardTitle>Campaign Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>{campaign.description}</p>
          <div className="flex justify-between">
            <span>Target: {campaign.target}</span>
            <span>Raised: {campaign.raised}</span>
          </div>
          <Progress value={(Number.parseInt(campaign.raised) / Number.parseInt(campaign.target)) * 100} />
          <div className="flex justify-between">
            <span>Backers: {campaign.backers}</span>
            <span>Deadline: {campaign.deadline}</span>
          </div>
          <div>Owner: {campaign.owner}</div>
          <Button className="w-full">Donate</Button>
        </CardContent>
      </Card>
      {/* Add more sections like updates, comments, etc. */}
    </div>
  )
}

export default CampaignDetails


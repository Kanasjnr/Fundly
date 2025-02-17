import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Button } from "../components/ui/button"

const CampaignListing = () => {
  const campaigns = [
    { id: 1, title: "Save the Forests", target: "10 ETH", raised: "5 ETH", backers: 50, deadline: "2023-12-31" },
    {
      id: 2,
      title: "Clean Ocean Initiative",
      target: "20 ETH",
      raised: "15 ETH",
      backers: 100,
      deadline: "2023-11-30",
    },
    { id: 3, title: "Education for All", target: "5 ETH", raised: "3 ETH", backers: 30, deadline: "2023-10-31" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Campaigns</h1>
        <Button>Create Campaign</Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Active Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Raised</TableHead>
                <TableHead>Backers</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell>{campaign.title}</TableCell>
                  <TableCell>{campaign.target}</TableCell>
                  <TableCell>{campaign.raised}</TableCell>
                  <TableCell>{campaign.backers}</TableCell>
                  <TableCell>{campaign.deadline}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default CampaignListing


import React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Progress } from "../components/ui/progress"

const Proposals = () => {
  const proposals = [
    {
      id: 1,
      title: "Increase Quorum Votes",
      description: "Proposal to increase the quorum votes from 100 to 150",
      forVotes: 80,
      againstVotes: 20,
      status: "Active",
    },
    {
      id: 2,
      title: "Add New Campaign Category",
      description: "Add 'Technology' as a new campaign category",
      forVotes: 120,
      againstVotes: 30,
      status: "Passed",
    },
    {
      id: 3,
      title: "Modify Reputation System",
      description: "Adjust the reputation scoring algorithm",
      forVotes: 50,
      againstVotes: 50,
      status: "Active",
    },
    // Add more sample proposals as needed
  ]

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Proposals</h1>
      {proposals.map((proposal) => (
        <Card key={proposal.id} className="mb-6">
          <CardHeader>
            <CardTitle>{proposal.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{proposal.description}</p>
            <div className="flex justify-between mb-2">
              <span>For: {proposal.forVotes}</span>
              <span>Against: {proposal.againstVotes}</span>
            </div>
            <Progress
              value={(proposal.forVotes / (proposal.forVotes + proposal.againstVotes)) * 100}
              className="mb-4"
            />
            <div className="flex justify-between">
              <span>Status: {proposal.status}</span>
              <div>
                <Button variant="outline" size="sm" className="mr-2">
                  Vote For
                </Button>
                <Button variant="outline" size="sm">
                  Vote Against
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      <Button>Create New Proposal</Button>
    </div>
  )
}

export default Proposals


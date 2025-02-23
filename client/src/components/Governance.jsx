import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"

const Governance = () => {
  const proposals = [
    { id: 1, title: "Increase Quorum Votes", votes: 120, status: "Active" },
    { id: 2, title: "Add New Campaign Category", votes: 85, status: "Passed" },
    { id: 3, title: "Modify Reputation System", votes: 50, status: "Active" },
    // Add more sample proposals as needed
  ]

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Governance</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Active Proposals</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Proposal</TableHead>
                <TableHead>Votes</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proposals.map((proposal) => (
                <TableRow key={proposal.id}>
                  <TableCell>{proposal.title}</TableCell>
                  <TableCell>{proposal.votes}</TableCell>
                  <TableCell>{proposal.status}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Vote
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Button>Create New Proposal</Button>
    </div>
  )
}

export default Governance


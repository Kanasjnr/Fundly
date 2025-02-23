"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Badge } from "../ui/badge"
import { Loader2 } from "lucide-react"
import CreateProposalDialog from "./CreateProposalDialog"
import VoteDialog from "./VoteDialog"
import useGetAllProposals from "../../hooks/Proposals/useGetAllProposals"
import useExecuteProposal from "../../hooks/Proposals/useExecuteProposal"

const Governance = () => {
  const [proposals, setProposals] = useState([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedProposal, setSelectedProposal] = useState(null)
  const { getAllProposals, loading: fetchingProposals } = useGetAllProposals()
  const { executeProposal, loading: executing } = useExecuteProposal()
  const navigate = useNavigate()

  useEffect(() => {
    fetchProposals()
  }, [])

  const fetchProposals = async () => {
    const data = await getAllProposals()
    if (data) {
      setProposals(data)
    }
  }

  const handleExecute = async (proposalId) => {
    const success = await executeProposal(proposalId)
    if (success) {
      fetchProposals()
    }
  }

  const getProposalStatus = (proposal) => {
    const now = Math.floor(Date.now() / 1000)

    if (proposal.executed) {
      return { label: "Executed", color: "bg-green-500/10 text-green-500" }
    }

    if (now > proposal.endTime) {
      if (proposal.forVotes > proposal.againstVotes) {
        return { label: "Passed", color: "bg-blue-500/10 text-blue-500" }
      }
      return { label: "Failed", color: "bg-red-500/10 text-red-500" }
    }

    return { label: "Active", color: "bg-yellow-500/10 text-yellow-500" }
  }

  if (fetchingProposals) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Governance</h1>
          <p className="text-muted-foreground">View and participate in protocol governance</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>Create New Proposal</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Proposals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{proposals.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Proposals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {proposals.filter((p) => getProposalStatus(p).label === "Active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Executed Proposals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{proposals.filter((p) => p.executed).length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Proposals</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-center">Votes</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proposals.map((proposal) => {
                const status = getProposalStatus(proposal)
                const canExecute = !proposal.executed && status.label === "Passed"

                return (
                  <TableRow key={proposal.id}>
                    <TableCell
                      className="font-medium max-w-md truncate cursor-pointer hover:text-primary"
                      onClick={() => navigate(`/dashboard/governance/${proposal.id}`)}
                    >
                      {proposal.description}
                    </TableCell>
                    <TableCell>{proposal.proposalType}</TableCell>
                    <TableCell className="text-center">
                      <span className="text-green-600">✓ {proposal.forVotes}</span>
                      {" / "}
                      <span className="text-red-600">✗ {proposal.againstVotes}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={status.color}>
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {status.label === "Active" && (
                          <Button variant="outline" size="sm" onClick={() => setSelectedProposal(proposal)}>
                            Vote
                          </Button>
                        )}
                        {canExecute && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleExecute(proposal.id)}
                            disabled={executing}
                          >
                            {executing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Execute"}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CreateProposalDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} onSuccess={fetchProposals} />

      <VoteDialog
        proposal={selectedProposal}
        onOpenChange={(open) => !open && setSelectedProposal(null)}
        onSuccess={fetchProposals}
      />
    </div>
  )
}

export default Governance


"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Loader2, ArrowLeft, ThumbsUp, ThumbsDown } from "lucide-react"
import useVoteOnProposal from "../../hooks/Proposals/useVoteOnProposal"
import useExecuteProposal from "../../hooks/Proposals/useExecuteProposal"
import useGetAllProposals from "../../hooks/Proposals/useGetAllProposals"

const ProposalDetails = () => {
  const { proposalId } = useParams()
  const navigate = useNavigate()
  const [proposal, setProposal] = useState(null)
  const { getAllProposals, loading: fetchingProposal, proposals } = useGetAllProposals()
  const { voteOnProposal, loading: voting } = useVoteOnProposal()
  const { executeProposal, loading: executing } = useExecuteProposal()

  useEffect(() => {
    console.log("ProposalDetails mounted, proposalId:", proposalId)
    if (proposals.length > 0) {
      const found = proposals.find((p) => p.id === Number(proposalId))
      console.log("Found proposal:", found)
      setProposal(found)
    }
  }, [proposalId, proposals])

  const handleVote = async (support) => {
    console.log("Voting on proposal:", proposalId, "support:", support)
    const success = await voteOnProposal(Number(proposalId), support)
    console.log("Vote result:", success)
    if (success) {
      await getAllProposals()
    }
  }

  const handleExecute = async () => {
    console.log("Executing proposal:", proposalId)
    const success = await executeProposal(Number(proposalId))
    console.log("Execution result:", success)
    if (success) {
      await getAllProposals()
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

  if (fetchingProposal || !proposal) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const status = getProposalStatus(proposal)
  const canExecute = status.label === "Passed" && !proposal.executed

  return (
    <div className="space-y-6">
      <Button variant="ghost" className="mb-6" onClick={() => navigate("/dashboard/governance")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Proposals
      </Button>

      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Proposal #{proposalId}</h1>
          <Badge variant="outline" className={status.color}>
            {status.label}
          </Badge>
        </div>
        {canExecute && (
          <Button onClick={handleExecute} disabled={executing}>
            {executing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Execute Proposal"}
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">Description</h3>
              <p className="text-muted-foreground">{proposal.description}</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Type</h3>
              <p className="text-muted-foreground">{proposal.proposalType}</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Campaign ID</h3>
              <p className="text-muted-foreground">{proposal.campaignId}</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Creator</h3>
              <p className="text-muted-foreground font-mono text-sm">{proposal.creator}</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Created At</h3>
              <p className="text-muted-foreground">{new Date(proposal.createdAt * 1000).toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Voting</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="space-y-1">
                <p className="text-3xl font-bold text-green-600">{proposal.forVotes}</p>
                <p className="text-sm text-muted-foreground">For</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold text-red-600">{proposal.againstVotes}</p>
                <p className="text-sm text-muted-foreground">Against</p>
              </div>
            </div>

            {status.label === "Active" && (
              <div className="flex gap-4">
                <Button className="flex-1" variant="outline" onClick={() => handleVote(true)} disabled={voting}>
                  <ThumbsUp className="mr-2 h-4 w-4" />
                  For
                </Button>
                <Button className="flex-1" variant="outline" onClick={() => handleVote(false)} disabled={voting}>
                  <ThumbsDown className="mr-2 h-4 w-4" />
                  Against
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ProposalDetails



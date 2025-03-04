"use client"

import { useState,memo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Loader2 } from "lucide-react"
import useCreateProposal from "../../hooks/Proposals/useCreateProposal"

const PROPOSAL_TYPES = {
  GENERAL: 0,
  PARAMETER: 1,
  UPGRADE: 2,
}

const VOTING_PERIODS = {
  86400: "1 Day",
  259200: "3 Days",
  604800: "1 Week",
}

const CreateProposalDialog = memo(({ open, onOpenChange, onSuccess }) => {
  const [formData, setFormData] = useState({
    campaignId: "",
    description: "",
    votingPeriod: "604800",
    proposalType: "GENERAL",
  })
  const { createProposal, loading } = useCreateProposal()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const success = await createProposal(
      Number(formData.campaignId),
      formData.description,
      Number(formData.votingPeriod),
      PROPOSAL_TYPES[formData.proposalType],
    )

    if (success) {
      onSuccess?.()
      setFormData({
        campaignId: "",
        description: "",
        votingPeriod: "604800",
        proposalType: "GENERAL",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Proposal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="campaignId">Campaign ID</Label>
            <Input
              id="campaignId"
              type="number"
              required
              value={formData.campaignId}
              onChange={(e) => setFormData((prev) => ({ ...prev, campaignId: e.target.value }))}
              placeholder="Enter campaign ID"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              required
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your proposal"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="votingPeriod">Voting Period</Label>
            <Select
              value={formData.votingPeriod}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, votingPeriod: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select voting period" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(VOTING_PERIODS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="proposalType">Proposal Type</Label>
            <Select
              value={formData.proposalType}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, proposalType: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select proposal type" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(PROPOSAL_TYPES).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0) + type.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Proposal"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
})

CreateProposalDialog.displayName = "CreateProposalDialog"

export default CreateProposalDialog

  


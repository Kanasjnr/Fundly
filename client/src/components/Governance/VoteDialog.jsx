import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { ThumbsUp, ThumbsDown, Loader2 } from "lucide-react";
import useVoteOnProposal from "../../hooks/Proposals/useVoteOnProposal";

const VoteDialog = ({ proposal, onOpenChange, onSuccess }) => {
  console.log("Rendering VoteDialog, proposal:", proposal);

  const { voteOnProposal, loading } = useVoteOnProposal();

  if (!proposal) return null;

  const handleVote = async (support) => {
    console.log("Voting on proposal:", proposal.id, "support:", support);
    const success = await voteOnProposal(proposal.id, support);
    console.log("Vote result:", success);
    if (success) {
      onSuccess?.();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={!!proposal} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cast Your Vote</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Card className="p-4">
            <h3 className="font-medium mb-2">Proposal</h3>
            <p className="text-sm text-muted-foreground">
              {proposal?.description}
            </p>
          </Card>

          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => handleVote(true)}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <ThumbsUp className="mr-2 h-4 w-4" />
                  For
                </>
              )}
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => handleVote(false)}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <ThumbsDown className="mr-2 h-4 w-4" />
                  Against
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VoteDialog;

"use client";

import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import useContract from "../useContract";
import FundlyABI from "../../abis/Fundly.json";

const useGetProposalsPaginated = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fundlyAddress = import.meta.env.VITE_APP_FUNDLY_CONTRACT_ADDRESS;
  const { contract } = useContract(fundlyAddress, FundlyABI);

  const getProposalsPaginated = useCallback(
    async (startIndex = 0, pageSize = 10) => {
      if (!contract) {
        // toast.error("Contract is not available");
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const proposals = await contract.getProposalsPaginated(
          startIndex,
          pageSize
        );

        // Format the proposals
        return proposals.map((proposal) => ({
          id: Number(proposal.id),
          description: proposal.description,
          forVotes: Number(proposal.forVotes),
          againstVotes: Number(proposal.againstVotes),
          executed: proposal.executed,
          endTime: Number(proposal.endTime),
          totalVotes: Number(proposal.totalVotes),
          campaignId: Number(proposal.campaignId),
          proposalType: Number(proposal.proposalType),
          proposalTypeText: ["Fund Allocation", "Milestone Adjustment"][
            Number(proposal.proposalType)
          ],
          createdAt: Number(proposal.createdAt),
          creator: proposal.creator,
          newMilestones:
            proposal.newMilestones?.map((m) => ethers.formatEther(m)) || [],
        }));
      } catch (err) {
        console.error("Error fetching paginated proposals:", err);
        setError(
          "Error fetching proposals: " + (err.message || "Unknown error")
        );
        toast.error(`Error: ${err.message || "An unknown error occurred."}`);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [contract]
  );

  return { getProposalsPaginated, loading, error };
};

export default useGetProposalsPaginated;

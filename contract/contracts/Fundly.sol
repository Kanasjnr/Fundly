// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./KYCManager.sol";

contract Fundly is ERC721 {
    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        address[] donators;
        uint256[] donations;
        bool paidOut;
    }

    struct Proposal {
        uint256 id;
        string description;
        uint256 forVotes;
        uint256 againstVotes;
        bool executed;
        uint256 endTime;
        uint256 totalVotes;
    }

    KYCManager public kycManager;
    Campaign[] public campaigns;
    uint256 public proposalCount;
    uint256 public quorumVotes;
    uint256 private _tokenIds;

    mapping(uint256 => Proposal) public proposals;
    mapping(address => mapping(uint256 => bool)) public hasVoted;
    mapping(address => uint256[]) private _userCampaigns;

    event CampaignCreated(uint256 indexed campaignId, address indexed owner, string title);
    event DonationMade(uint256 indexed campaignId, address indexed donator, uint256 amount);
    event CampaignPaidOut(uint256 indexed campaignId, address indexed owner, uint256 amount);
    event ProposalCreated(uint256 indexed proposalId, string description, uint256 endTime);
    event Voted(uint256 indexed proposalId, address indexed voter, bool support, uint256 votes);
    event ProposalExecuted(uint256 indexed proposalId);

    constructor(address _kycManager, uint256 _quorumVotes) ERC721("FundlyCampaignNFT", "FCN") {
        require(_quorumVotes > 0, "Quorum votes must be greater than 0");
        kycManager = KYCManager(_kycManager);
        quorumVotes = _quorumVotes;
    }

    function createCampaign(
        string memory _title,
        string memory _description,
        uint256 _target,
        uint256 _deadline,
        string memory _image
    ) public returns (uint256) {
        require(kycManager.isUserVerified(msg.sender), "User is not KYC verified");
        require(_deadline > block.timestamp, "Deadline should be in the future");

        Campaign memory newCampaign = Campaign({
            owner: msg.sender,
            title: _title,
            description: _description,
            target: _target,
            deadline: _deadline,
            amountCollected: 0,
            image: _image,
            donators: new address[](0),
            donations: new uint256[](0),
            paidOut: false
        });

        campaigns.push(newCampaign);
        uint256 campaignId = campaigns.length - 1;
        _userCampaigns[msg.sender].push(campaignId);
        emit CampaignCreated(campaignId, msg.sender, _title);
        return campaignId;
    }

    function donateCampaign(uint256 _id) public payable {
        require(_id < campaigns.length, "Invalid campaign ID");
        uint256 amount = msg.value;
        Campaign storage campaign = campaigns[_id];

        campaign.donators.push(msg.sender);
        campaign.donations.push(amount);
        campaign.amountCollected += amount;

        _tokenIds++;
        _safeMint(msg.sender, _tokenIds);

        emit DonationMade(_id, msg.sender, amount);
    }

    function getCampaigns() public view returns (Campaign[] memory) {
        return campaigns;
    }

    function getCampaign(uint256 _id) public view returns (
        address owner,
        string memory title,
        string memory description,
        uint256 target,
        uint256 deadline,
        uint256 amountCollected,
        string memory image,
        address[] memory donators,
        uint256[] memory donations,
        bool paidOut
    ) {
        require(_id < campaigns.length, "Invalid campaign ID");
        Campaign storage campaign = campaigns[_id];
        return (
            campaign.owner,
            campaign.title,
            campaign.description,
            campaign.target,
            campaign.deadline,
            campaign.amountCollected,
            campaign.image,
            campaign.donators,
            campaign.donations,
            campaign.paidOut
        );
    }

    function getCampaignsByOwner(address owner) public view returns (uint256[] memory) {
        return _userCampaigns[owner];
    }

    function payoutCampaign(uint256 _id) public {
        require(_id < campaigns.length, "Invalid campaign ID");
        Campaign storage campaign = campaigns[_id];
        require(msg.sender == campaign.owner, "Only the campaign owner can withdraw funds");
        require(!campaign.paidOut, "Funds already withdrawn");
        require(campaign.amountCollected >= campaign.target, "Target not reached");

        campaign.paidOut = true;
        payable(campaign.owner).transfer(campaign.amountCollected);

        emit CampaignPaidOut(_id, campaign.owner, campaign.amountCollected);
    }

    function createProposal(string memory description, uint256 votingPeriod) public {
        require(kycManager.isUserVerified(msg.sender), "User is not KYC verified");
        proposalCount++;
        proposals[proposalCount] = Proposal({
            id: proposalCount,
            description: description,
            forVotes: 0,
            againstVotes: 0,
            executed: false,
            endTime: block.timestamp + votingPeriod,
            totalVotes: 0
        });

        emit ProposalCreated(proposalCount, description, block.timestamp + votingPeriod);
    }

    function voteOnProposal(uint256 proposalId, bool support) public {
        require(kycManager.isUserVerified(msg.sender), "User is not KYC verified");
        require(!hasVoted[msg.sender][proposalId], "Already voted");
        require(!proposals[proposalId].executed, "Proposal already executed");
        require(block.timestamp <= proposals[proposalId].endTime, "Voting period has ended");

        uint256 votes = msg.sender.balance;
        Proposal storage proposal = proposals[proposalId];

        if (support) {
            proposal.forVotes += votes;
        } else {
            proposal.againstVotes += votes;
        }

        proposal.totalVotes += votes;
        hasVoted[msg.sender][proposalId] = true;

        emit Voted(proposalId, msg.sender, support, votes);
    }

    function executeProposal(uint256 proposalId) public {
        Proposal storage proposal = proposals[proposalId];
        require(!proposal.executed, "Proposal already executed");
        require(block.timestamp > proposal.endTime, "Voting period not ended");
        require(proposal.totalVotes >= quorumVotes, "Quorum not reached");
        require(proposal.forVotes > proposal.againstVotes, "Proposal did not pass");

        proposal.executed = true;
        // Implement the logic to execute the proposal
        
        emit ProposalExecuted(proposalId);
    }

    function getProposalDetails(uint256 proposalId) public view returns (
        uint256 id,
        string memory description,
        uint256 forVotes,
        uint256 againstVotes,
        bool executed,
        uint256 endTime,
        uint256 totalVotes,
        bool quorumReached,
        bool passed
    ) {
        require(proposalId > 0 && proposalId <= proposalCount, "Invalid proposal ID");
        
        Proposal storage proposal = proposals[proposalId];
        
        return (
            proposal.id,
            proposal.description,
            proposal.forVotes,
            proposal.againstVotes,
            proposal.executed,
            proposal.endTime,
            proposal.totalVotes,
            proposal.totalVotes >= quorumVotes,
            proposal.forVotes > proposal.againstVotes
        );
    }

    function updateQuorumVotes(uint256 newQuorumVotes) public {
        // This function should ideally be controlled by governance
        // For now, we'll leave it open, but in production, add access control
        require(newQuorumVotes > 0, "Quorum votes must be greater than 0");
        quorumVotes = newQuorumVotes;
    }
}
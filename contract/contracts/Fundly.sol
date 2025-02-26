// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./KYCManager.sol";

contract Fundly is ERC721URIStorage, ERC721Enumerable, AccessControl {
    using Strings for uint256;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    uint256 public constant MINIMUM_CAMPAIGN_DURATION = 1 days;
    uint256 public constant MAXIMUM_CAMPAIGN_DURATION = 90 days;
    uint256 public constant MINIMUM_TARGET_AMOUNT = 0.1 ether;
    uint256 public constant MAXIMUM_MILESTONES = 10;

    enum CampaignStatus {
        Active,
        Successful,
        Failed,
        Paid
    }
    enum ProposalType {
        FundAllocation,
        MilestoneAdjustment
    }

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
        uint256[] milestones;
        uint256 currentMilestone;
        CampaignStatus status;
    }

    struct Proposal {
        uint256 id;
        string description;
        uint256 forVotes;
        uint256 againstVotes;
        bool executed;
        uint256 endTime;
        uint256 totalVotes;
        uint256 campaignId;
        ProposalType proposalType;
        uint256 createdAt;
        address creator;
    }

    struct UserStats {
        uint256 campaignsCreated;
        uint256 campaignsBacked;
        uint256 proposalsCreated;
        uint256 proposalsVoted;
        uint256 totalDonated;
        uint256 reputationScore;
        uint256 reputationTier;
        uint256 lastActivityTimestamp;
    }

    KYCManager public immutable kycManager;
    Campaign[] private campaigns;
    uint256 public proposalCount;
    uint256 public immutable quorumVotes;
    uint256 private _nextTokenId;

    // Mappings to track token metadata
    mapping(uint256 => uint256) private _tokenToCampaign;
    mapping(uint256 => uint256) private _tokenToDonationAmount;

    mapping(uint256 => Proposal) public proposals;
    mapping(address => mapping(uint256 => bool)) public hasVoted;
    mapping(address => uint256[]) private _userCampaigns;
    mapping(address => UserStats) public userStats;
    mapping(uint256 => mapping(address => uint256)) private _campaignDonations;

    event CampaignCreated(
        uint256 indexed campaignId,
        address indexed owner,
        string title,
        uint256 target,
        uint256 deadline
    );
    event DonationMade(
        uint256 indexed campaignId,
        address indexed donator,
        uint256 amount,
        uint256 tokenId
    );
    event CampaignPaidOut(
        uint256 indexed campaignId,
        address indexed owner,
        uint256 amount
    );
    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed creator,
        string description,
        uint256 endTime,
        uint256 campaignId
    );
    event Voted(
        uint256 indexed proposalId,
        address indexed voter,
        bool support,
        uint256 votes
    );
    event ProposalExecuted(uint256 indexed proposalId, bool success);
    event MilestoneUpdated(
        uint256 indexed campaignId,
        uint256 milestoneIndex,
        uint256 newValue
    );
    event ReputationUpdated(
        address indexed user,
        uint256 newScore,
        uint256 newTier
    );
    event CampaignStatusChanged(
        uint256 indexed campaignId,
        CampaignStatus newStatus
    );

    error InvalidAddress();
    error InvalidAmount();
    error InvalidDuration();
    error InvalidKYC();
    error DeadlinePassed();
    error CampaignNotFound();
    error AlreadyVoted();
    error ProposalNotFound();
    error QuorumNotReached();
    error ProposalNotPassed();
    error TransferFailed();
    error Unauthorized();
    error InvalidMilestoneCount();
    error TokenDoesNotExist();

    modifier validAddress(address _address) {
        if (_address == address(0)) revert InvalidAddress();
        _;
    }

    modifier campaignExists(uint256 _id) {
        if (_id >= campaigns.length) revert CampaignNotFound();
        _;
    }

    modifier onlyKYCVerified() {
        if (!kycManager.isUserVerified(msg.sender)) revert InvalidKYC();
        _;
    }

    constructor(
        address _kycManager,
        uint256 _quorumVotes
    ) ERC721("FundlyCampaignNFT", "FCN") validAddress(_kycManager) {
        if (_quorumVotes == 0) revert InvalidAmount();

        kycManager = KYCManager(_kycManager);
        quorumVotes = _quorumVotes;

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    function createCampaign(
        string memory _title,
        string memory _description,
        uint256 _target,
        uint256 _deadline,
        string memory _image,
        uint256[] memory _milestones
    ) public onlyKYCVerified returns (uint256) {
        if (_target < MINIMUM_TARGET_AMOUNT) revert InvalidAmount();
        if (_deadline <= block.timestamp) revert DeadlinePassed();
        if (_deadline > block.timestamp + MAXIMUM_CAMPAIGN_DURATION)
            revert InvalidDuration();
        if (_milestones.length > MAXIMUM_MILESTONES)
            revert InvalidMilestoneCount();

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
            paidOut: false,
            milestones: _milestones,
            currentMilestone: 0,
            status: CampaignStatus.Active
        });

        campaigns.push(newCampaign);
        uint256 campaignId = campaigns.length - 1;
        _userCampaigns[msg.sender].push(campaignId);

        UserStats storage stats = userStats[msg.sender];
        stats.campaignsCreated++;
        stats.lastActivityTimestamp = block.timestamp;
        updateReputation(msg.sender, 20);

        emit CampaignCreated(
            campaignId,
            msg.sender,
            _title,
            _target,
            _deadline
        );
        return campaignId;
    }

    function donateCampaign(uint256 _id) public payable campaignExists(_id) {
        Campaign storage campaign = campaigns[_id];

        if (block.timestamp > campaign.deadline) revert DeadlinePassed();
        if (msg.value == 0) revert InvalidAmount();
        if (campaign.status != CampaignStatus.Active) revert Unauthorized();

        campaign.amountCollected += msg.value;
        campaign.donators.push(msg.sender);
        campaign.donations.push(msg.value);
        _campaignDonations[_id][msg.sender] += msg.value;

        uint256 newTokenId = _nextTokenId++;
        _safeMint(msg.sender, newTokenId);
        
        // Store token metadata
        _tokenToCampaign[newTokenId] = _id;
        _tokenToDonationAmount[newTokenId] = msg.value;

        string memory tokenURI = generateTokenURI(_id, msg.value);
        _setTokenURI(newTokenId, tokenURI);

        UserStats storage stats = userStats[msg.sender];
        stats.campaignsBacked++;
        stats.totalDonated += msg.value;
        stats.lastActivityTimestamp = block.timestamp;
        updateReputation(msg.sender, 10);

        if (campaign.amountCollected >= campaign.target) {
            campaign.status = CampaignStatus.Successful;
            emit CampaignStatusChanged(_id, CampaignStatus.Successful);
        }

        emit DonationMade(_id, msg.sender, msg.value, newTokenId);
    }

    function withdrawCampaignFunds(uint256 _id) public campaignExists(_id) {
        Campaign storage campaign = campaigns[_id];

        if (msg.sender != campaign.owner) revert Unauthorized();
        if (campaign.status != CampaignStatus.Successful) revert Unauthorized();
        if (campaign.paidOut) revert Unauthorized();

        campaign.paidOut = true;
        campaign.status = CampaignStatus.Paid;

        (bool success, ) = campaign.owner.call{value: campaign.amountCollected}(
            ""
        );
        if (!success) revert TransferFailed();

        emit CampaignPaidOut(_id, campaign.owner, campaign.amountCollected);
        emit CampaignStatusChanged(_id, CampaignStatus.Paid);
    }

    function createProposal(
        uint256 campaignId,
        string memory description,
        uint256 votingPeriod,
        ProposalType proposalType
    ) public onlyKYCVerified campaignExists(campaignId) {
        if (votingPeriod < 1 days || votingPeriod > 7 days)
            revert InvalidDuration();

        proposalCount++;
        proposals[proposalCount] = Proposal({
            id: proposalCount,
            description: description,
            forVotes: 0,
            againstVotes: 0,
            executed: false,
            endTime: block.timestamp + votingPeriod,
            totalVotes: 0,
            campaignId: campaignId,
            proposalType: proposalType,
            createdAt: block.timestamp,
            creator: msg.sender
        });

        UserStats storage stats = userStats[msg.sender];
        stats.proposalsCreated++;
        stats.lastActivityTimestamp = block.timestamp;
        updateReputation(msg.sender, 5);

        emit ProposalCreated(
            proposalCount,
            msg.sender,
            description,
            block.timestamp + votingPeriod,
            campaignId
        );
    }

    function voteOnProposal(
        uint256 proposalId,
        bool support
    ) public onlyKYCVerified {
        Proposal storage proposal = proposals[proposalId];
        if (proposal.id == 0) revert ProposalNotFound();
        if (hasVoted[msg.sender][proposalId]) revert AlreadyVoted();
        if (proposal.executed) revert Unauthorized();
        if (block.timestamp > proposal.endTime) revert DeadlinePassed();

        uint256 votes = balanceOf(msg.sender);
        if (votes == 0) revert Unauthorized();

        if (support) {
            proposal.forVotes += votes;
        } else {
            proposal.againstVotes += votes;
        }

        proposal.totalVotes += votes;
        hasVoted[msg.sender][proposalId] = true;

        UserStats storage stats = userStats[msg.sender];
        stats.proposalsVoted++;
        stats.lastActivityTimestamp = block.timestamp;
        updateReputation(msg.sender, 2);

        emit Voted(proposalId, msg.sender, support, votes);
    }

    function executeProposal(uint256 proposalId) public {
        Proposal storage proposal = proposals[proposalId];
        if (proposal.id == 0) revert ProposalNotFound();
        if (proposal.executed) revert Unauthorized();
        if (block.timestamp <= proposal.endTime) revert DeadlinePassed();
        if (proposal.totalVotes < quorumVotes) revert QuorumNotReached();
        if (proposal.forVotes <= proposal.againstVotes)
            revert ProposalNotPassed();

        proposal.executed = true;
        bool success = true;

        if (proposal.proposalType == ProposalType.MilestoneAdjustment) {
            // Implementation for milestone adjustment
            success = _executeMilestoneAdjustment(proposal);
        }

        emit ProposalExecuted(proposalId, success);
    }

    function _executeMilestoneAdjustment(
        Proposal storage proposal
    ) private returns (bool) {
        // Implementation for milestone adjustment
        return true;
    }

    function updateMilestone(
        uint256 campaignId,
        uint256 milestoneIndex,
        uint256 newValue
    ) public campaignExists(campaignId) {
        Campaign storage campaign = campaigns[campaignId];
        if (msg.sender != campaign.owner) revert Unauthorized();
        if (milestoneIndex >= campaign.milestones.length)
            revert InvalidMilestoneCount();

        campaign.milestones[milestoneIndex] = newValue;
        emit MilestoneUpdated(campaignId, milestoneIndex, newValue);
    }

    function updateReputation(address user, uint256 points) internal {
        UserStats storage stats = userStats[user];
        stats.reputationScore += points;

        uint256 newTier;
        if (stats.reputationScore < 100) {
            newTier = 1;
        } else if (stats.reputationScore < 500) {
            newTier = 2;
        } else {
            newTier = 3;
        }

        if (newTier != stats.reputationTier) {
            stats.reputationTier = newTier;
            emit ReputationUpdated(user, stats.reputationScore, newTier);
        }
    }

    // NFT-related functions

    // Get all NFTs owned by a specific user
    function getUserNFTs(address user) public view returns (uint256[] memory) {
        uint256 balance = balanceOf(user);
        uint256[] memory tokenIds = new uint256[](balance);
        
        for (uint256 i = 0; i < balance; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(user, i);
        }
        
        return tokenIds;
    }

    // Get campaign-specific NFTs owned by a user
    function getUserCampaignNFTs(address user, uint256 campaignId) public view campaignExists(campaignId) returns (uint256[] memory) {
        uint256 balance = balanceOf(user);
        
        // First, count how many NFTs the user has for this campaign
        uint256 count = 0;
        for (uint256 i = 0; i < balance; i++) {
            uint256 tokenId = tokenOfOwnerByIndex(user, i);
            if (_tokenToCampaign[tokenId] == campaignId) {
                count++;
            }
        }
        
        // Then create the array of the right size
        uint256[] memory campaignTokens = new uint256[](count);
        uint256 index = 0;
        
        for (uint256 i = 0; i < balance; i++) {
            uint256 tokenId = tokenOfOwnerByIndex(user, i);
            if (_tokenToCampaign[tokenId] == campaignId) {
                campaignTokens[index] = tokenId;
                index++;
            }
        }
        
        return campaignTokens;
    }

    // Get NFT details
    function getNFTDetails(uint256 tokenId) public view returns (
        uint256 campaignId,
        uint256 donationAmount,
        string memory uri
    ) {
        if (!_exists(tokenId)) revert TokenDoesNotExist();
        
        campaignId = _tokenToCampaign[tokenId];
        donationAmount = _tokenToDonationAmount[tokenId];
        uri = tokenURI(tokenId);
    }

    // Get all donation NFTs for a campaign
    function getCampaignNFTs(uint256 campaignId) public view campaignExists(campaignId) returns (uint256[] memory) {
        // This is less efficient as we need to check all tokens
        // A better implementation would track tokens by campaign
        
        uint256 totalSupply = _nextTokenId;
        
        // First, count tokens for this campaign
        uint256 count = 0;
        for (uint256 i = 0; i < totalSupply; i++) {
            if (_exists(i) && _tokenToCampaign[i] == campaignId) {
                count++;
            }
        }
        
        // Then create the array
        uint256[] memory campaignTokens = new uint256[](count);
        uint256 index = 0;
        
        for (uint256 i = 0; i < totalSupply; i++) {
            if (_exists(i) && _tokenToCampaign[i] == campaignId) {
                campaignTokens[index] = i;
                index++;
            }
        }
        
        return campaignTokens;
    }

    // Helper function to check if a token exists
    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }

    // View Functions
    function getAllCampaigns() public view returns (Campaign[] memory) {
        return campaigns;
    }

    function getCampaign(
        uint256 campaignId
    ) public view campaignExists(campaignId) returns (Campaign memory) {
        return campaigns[campaignId];
    }

    function getAllProposals() public view returns (Proposal[] memory) {
        Proposal[] memory allProposals = new Proposal[](proposalCount);
        for (uint256 i = 1; i <= proposalCount; i++) {
            allProposals[i - 1] = proposals[i];
        }
        return allProposals;
    }

    function getCampaignFundFlow(
        uint256 campaignId
    )
        public
        view
        campaignExists(campaignId)
        returns (uint256[] memory, uint256[] memory)
    {
        return (
            campaigns[campaignId].donations,
            campaigns[campaignId].milestones
        );
    }

    function getCampaignAnalytics(
        uint256 campaignId
    )
        public
        view
        campaignExists(campaignId)
        returns (
            uint256 totalBackers,
            uint256 fundingProgress,
            uint256 timeRemaining,
            uint256 currentMilestone
        )
    {
        Campaign storage campaign = campaigns[campaignId];

        totalBackers = campaign.donators.length;
        fundingProgress = (campaign.amountCollected * 100) / campaign.target;
        timeRemaining = campaign.deadline > block.timestamp
            ? campaign.deadline - block.timestamp
            : 0;
        currentMilestone = campaign.currentMilestone;
    }

    function getUserStats(
        address user
    ) public view validAddress(user) returns (UserStats memory) {
        return userStats[user];
    }

    function getUserCampaigns(
        address user
    ) public view validAddress(user) returns (uint256[] memory) {
        return _userCampaigns[user];
    }

    function generateTokenURI(
        uint256 campaignId,
        uint256 amount
    ) internal pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    "https://api.fundly.com/nft/",
                    campaignId.toString(),
                    "/",
                    amount.toString()
                )
            );
    }

    // Override required functions
    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721URIStorage, ERC721Enumerable, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
}


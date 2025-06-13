// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./KYCManager.sol";

contract Fundly is ERC721Enumerable, AccessControl, Pausable, ReentrancyGuard {
    using Strings for uint256;

    // ============ Constants ============
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    uint256 public constant MINIMUM_CAMPAIGN_DURATION = 1 days;
    uint256 public constant MAXIMUM_CAMPAIGN_DURATION = 90 days;
    uint256 public constant MINIMUM_TARGET_AMOUNT = 0.1 ether;
    uint256 public constant MAXIMUM_TARGET_AMOUNT = 1000 ether;
    uint256 public constant MAXIMUM_MILESTONES = 10;
    uint256 public constant MAX_BATCH_SIZE = 100;
    uint256 public constant MAX_REPUTATION_SCORE = 10000;

    // ============ Enums ============
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

    // ============ Structs ============
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
        uint256 createdAt;
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
        uint256[] newMilestones;
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

    struct TokenData {
        uint256 campaignId;
        uint256 donationAmount;
    }

    // ============ State Variables ============
    KYCManager public immutable kycManager;
    Campaign[] private campaigns;
    uint256 public proposalCount;
    uint256 public immutable quorumVotes;
    uint256 private _nextTokenId;

    mapping(uint256 => Proposal) public proposals;
    mapping(address => mapping(uint256 => bool)) public hasVoted;
    mapping(address => uint256[]) private _userCampaigns;
    mapping(address => UserStats) public userStats;
    mapping(uint256 => mapping(address => uint256)) private _campaignDonations;
    mapping(uint256 => mapping(address => bool)) private _refundClaimed;
    mapping(uint256 => TokenData) private _tokenData;
    mapping(uint256 => string) private _tokenURIs;

    // ============ Events ============
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
        uint256 campaignId,
        ProposalType proposalType
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

    event MilestonesAdjusted(
        uint256 indexed campaignId,
        uint256[] newMilestones
    );

    event MilestoneCompleted(
        uint256 indexed campaignId,
        uint256 milestoneIndex,
        string proof
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

    event RefundClaimed(
        uint256 indexed campaignId,
        address indexed donator,
        uint256 amount
    );

    // ============ Errors ============
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
    error IndexOutOfBounds();
    error RefundAlreadyClaimed();
    error CampaignNotFailed();
    error NonExistentToken();
    error InvalidStatus();
    error InvalidArrayLength();
    error InvalidProposalType();
    error ProposalStillActive();

    // ============ Modifiers ============

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

    modifier validArrayLength(uint256[] calldata _array, uint256 _maxLength) {
        if (_array.length > _maxLength) revert InvalidArrayLength();
        _;
    }

    // ============ Constructor ============

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

    // ============ Admin Functions ============

    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }

    function grantRole(
        bytes32 role,
        address account
    ) public override onlyRole(DEFAULT_ADMIN_ROLE) {
        super.grantRole(role, account);
        emit RoleGranted(role, account, msg.sender);
    }

    // ============ Campaign Management Functions ============

    function createCampaign(
        string memory _title,
        string memory _description,
        uint256 _target,
        uint256 _deadline,
        string memory _image,
        uint256[] memory _milestones
    ) public whenNotPaused onlyKYCVerified returns (uint256) {
        // Validate inputs
        if (_target < MINIMUM_TARGET_AMOUNT || _target > MAXIMUM_TARGET_AMOUNT)
            revert InvalidAmount();
        if (_deadline <= block.timestamp) revert DeadlinePassed();
        if (_deadline > block.timestamp + MAXIMUM_CAMPAIGN_DURATION)
            revert InvalidDuration();
        if (_milestones.length > MAXIMUM_MILESTONES)
            revert InvalidMilestoneCount();

        // Create campaign
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
            status: CampaignStatus.Active,
            createdAt: block.timestamp
        });

        campaigns.push(newCampaign);
        uint256 campaignId = campaigns.length - 1;
        _userCampaigns[msg.sender].push(campaignId);

        // Update user stats
        UserStats storage stats = userStats[msg.sender];
        stats.campaignsCreated++;
        stats.lastActivityTimestamp = block.timestamp;
        _updateReputation(msg.sender, 20);

        emit CampaignCreated(
            campaignId,
            msg.sender,
            _title,
            _target,
            _deadline
        );
        return campaignId;
    }

    /**
     *  Donate to a campaign
     */
    function donateCampaign(
        uint256 _id
    ) public payable whenNotPaused campaignExists(_id) {
        Campaign storage campaign = campaigns[_id];

        // Validate donation
        if (block.timestamp > campaign.deadline) revert DeadlinePassed();
        if (msg.value == 0) revert InvalidAmount();
        if (campaign.status != CampaignStatus.Active) revert InvalidStatus();

        // Update campaign state
        campaign.amountCollected += msg.value;
        campaign.donators.push(msg.sender);
        campaign.donations.push(msg.value);
        _campaignDonations[_id][msg.sender] += msg.value;

        // Mint NFT
        uint256 tokenId = _nextTokenId;
        _nextTokenId++;
        _safeMint(msg.sender, tokenId);

        // Store token data
        string memory uri = _generateTokenURI(_id, msg.value);
        _tokenURIs[tokenId] = uri;
        _tokenData[tokenId] = TokenData({
            campaignId: _id,
            donationAmount: msg.value
        });

        // Update user stats
        UserStats storage stats = userStats[msg.sender];
        stats.campaignsBacked++;
        stats.totalDonated += msg.value;
        stats.lastActivityTimestamp = block.timestamp;
        _updateReputation(msg.sender, 10);

        // Check if campaign is successful
        if (campaign.amountCollected >= campaign.target) {
            campaign.status = CampaignStatus.Successful;
            emit CampaignStatusChanged(_id, CampaignStatus.Successful);
        }

        emit DonationMade(_id, msg.sender, msg.value, tokenId);
    }

    /**
     *  Withdraws funds from a successful campaign
     */
    function withdrawCampaignFunds(
        uint256 _id
    ) public nonReentrant whenNotPaused campaignExists(_id) {
        Campaign storage campaign = campaigns[_id];

        // Validate withdrawal
        if (msg.sender != campaign.owner) revert Unauthorized();
        if (campaign.status != CampaignStatus.Successful)
            revert InvalidStatus();
        if (campaign.paidOut) revert Unauthorized();

        // Update state before external call to prevent reentrancy
        campaign.paidOut = true;
        campaign.status = CampaignStatus.Paid;
        uint256 amount = campaign.amountCollected;

        // Transfer funds
        (bool success, ) = campaign.owner.call{value: amount}("");
        if (!success) revert TransferFailed();

        emit CampaignPaidOut(_id, campaign.owner, amount);
        emit CampaignStatusChanged(_id, CampaignStatus.Paid);
    }

    /**
     *  Checks and updates a campaign's status
     */
    function checkCampaignStatus(
        uint256 _id
    ) public whenNotPaused campaignExists(_id) {
        Campaign storage campaign = campaigns[_id];

        if (
            campaign.status == CampaignStatus.Active &&
            block.timestamp > campaign.deadline
        ) {
            if (campaign.amountCollected >= campaign.target) {
                campaign.status = CampaignStatus.Successful;
                emit CampaignStatusChanged(_id, CampaignStatus.Successful);
            } else {
                campaign.status = CampaignStatus.Failed;
                emit CampaignStatusChanged(_id, CampaignStatus.Failed);
            }
        }
    }

    /**
     *  Claim a refund for a failed campaign
     */
    function claimRefund(
        uint256 _id
    ) public nonReentrant whenNotPaused campaignExists(_id) {
        Campaign storage campaign = campaigns[_id];

        // Validate refund
        if (campaign.status != CampaignStatus.Failed)
            revert CampaignNotFailed();
        if (_refundClaimed[_id][msg.sender]) revert RefundAlreadyClaimed();

        uint256 donationAmount = _campaignDonations[_id][msg.sender];
        if (donationAmount == 0) revert InvalidAmount();

        // Update state before external call to prevent reentrancy
        _refundClaimed[_id][msg.sender] = true;

        // Transfer refund
        (bool success, ) = msg.sender.call{value: donationAmount}("");
        if (!success) revert TransferFailed();

        emit RefundClaimed(_id, msg.sender, donationAmount);
    }

    /**
     * Updates the status of multiple campaigns
     */
    function updateCampaignStatuses(
        uint256[] calldata campaignIds
    ) public whenNotPaused validArrayLength(campaignIds, MAX_BATCH_SIZE) {
        for (uint256 i = 0; i < campaignIds.length; i++) {
            uint256 id = campaignIds[i];
            if (id >= campaigns.length) continue;

            Campaign storage campaign = campaigns[id];

            if (campaign.status == CampaignStatus.Active) {
                if (block.timestamp > campaign.deadline) {
                    if (campaign.amountCollected >= campaign.target) {
                        campaign.status = CampaignStatus.Successful;
                    } else {
                        campaign.status = CampaignStatus.Failed;
                    }
                    emit CampaignStatusChanged(id, campaign.status);
                }
            }
        }
    }

    // ============ Proposal and Governance Functions ============

    function createProposal(
        uint256 campaignId,
        string memory description,
        uint256 votingPeriod,
        ProposalType proposalType,
        uint256[] memory newMilestones
    ) public whenNotPaused onlyKYCVerified campaignExists(campaignId) {
        // Validate proposal
        if (votingPeriod < 1 days || votingPeriod > 7 days)
            revert InvalidDuration();

        // For milestone adjustment proposals, validate the new milestones
        if (proposalType == ProposalType.MilestoneAdjustment) {
            if (
                newMilestones.length == 0 ||
                newMilestones.length > MAXIMUM_MILESTONES
            ) revert InvalidMilestoneCount();
        } else if (proposalType != ProposalType.FundAllocation) {
            revert InvalidProposalType();
        }

        // Create proposal
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
            creator: msg.sender,
            newMilestones: newMilestones
        });

        // Update user stats
        UserStats storage stats = userStats[msg.sender];
        stats.proposalsCreated++;
        stats.lastActivityTimestamp = block.timestamp;
        _updateReputation(msg.sender, 5);

        emit ProposalCreated(
            proposalCount,
            msg.sender,
            description,
            block.timestamp + votingPeriod,
            campaignId,
            proposalType
        );
    }

    /**
     *  Votes on a proposal
    
     */
    function voteOnProposal(
        uint256 proposalId,
        bool support
    ) public whenNotPaused onlyKYCVerified {
        Proposal storage proposal = proposals[proposalId];

        // Validate vote
        if (proposal.id == 0) revert ProposalNotFound();
        if (hasVoted[msg.sender][proposalId]) revert AlreadyVoted();
        if (proposal.executed) revert Unauthorized();
        if (block.timestamp > proposal.endTime) revert DeadlinePassed();

        uint256 votes = balanceOf(msg.sender);
        if (votes == 0) revert Unauthorized();

        // Update proposal votes
        if (support) {
            proposal.forVotes += votes;
        } else {
            proposal.againstVotes += votes;
        }

        proposal.totalVotes += votes;
        hasVoted[msg.sender][proposalId] = true;

        // Update user stats
        UserStats storage stats = userStats[msg.sender];
        stats.proposalsVoted++;
        stats.lastActivityTimestamp = block.timestamp;
        _updateReputation(msg.sender, 2);

        emit Voted(proposalId, msg.sender, support, votes);
    }

    /**
     *  Executes a passed proposal
     */
    function executeProposal(uint256 proposalId) public whenNotPaused {
        Proposal storage proposal = proposals[proposalId];

        // Validate execution
        if (proposal.id == 0) revert ProposalNotFound();
        if (proposal.executed) revert Unauthorized();
        if (block.timestamp <= proposal.endTime) revert ProposalStillActive();
        if (proposal.totalVotes < quorumVotes) revert QuorumNotReached();
        if (proposal.forVotes <= proposal.againstVotes)
            revert ProposalNotPassed();

        // Mark as executed
        proposal.executed = true;
        bool success = true;

        // Execute based on proposal type
        if (proposal.proposalType == ProposalType.MilestoneAdjustment) {
            success = _executeMilestoneAdjustment(proposal);
        } else if (proposal.proposalType == ProposalType.FundAllocation) {
            // Implementation for fund allocation
            // This would be implemented based on specific requirements
        }

        emit ProposalExecuted(proposalId, success);
    }

    /**
     *  Executes a milestone adjustment proposal

     */
    function _executeMilestoneAdjustment(
        Proposal storage proposal
    ) private returns (bool) {
        uint256 campaignId = proposal.campaignId;
        Campaign storage campaign = campaigns[campaignId];

        // Update the campaign's milestones with the new ones from the proposal
        campaign.milestones = proposal.newMilestones;

        emit MilestonesAdjusted(campaignId, proposal.newMilestones);
        return true;
    }

    /**
     *  Updates a milestone
     * @param campaignId Campaign ID
     * @param milestoneIndex Index of the milestone to update
     * @param newValue New value for the milestone
     */
    function updateMilestone(
        uint256 campaignId,
        uint256 milestoneIndex,
        uint256 newValue
    ) public whenNotPaused campaignExists(campaignId) {
        Campaign storage campaign = campaigns[campaignId];

        // Validate update
        if (msg.sender != campaign.owner) revert Unauthorized();
        if (milestoneIndex >= campaign.milestones.length)
            revert IndexOutOfBounds();

        campaign.milestones[milestoneIndex] = newValue;
        emit MilestoneUpdated(campaignId, milestoneIndex, newValue);
    }

    /**
     *  Completes a milestone
    
     */
    function completeMilestone(
        uint256 campaignId,
        string memory proof
    ) public whenNotPaused campaignExists(campaignId) {
        Campaign storage campaign = campaigns[campaignId];

        // Validate completion
        if (msg.sender != campaign.owner) revert Unauthorized();
        if (campaign.currentMilestone >= campaign.milestones.length)
            revert InvalidMilestoneCount();

        uint256 completedMilestoneIndex = campaign.currentMilestone;
        campaign.currentMilestone++;

        emit MilestoneCompleted(campaignId, completedMilestoneIndex, proof);
    }

    // ============ Reputation System ============
    /**
     *  Updates a user's reputation
    
     */
    function _updateReputation(address user, uint256 points) internal {
        UserStats storage stats = userStats[user];

        // Cap reputation score
        uint256 newScore = stats.reputationScore + points;
        if (newScore > MAX_REPUTATION_SCORE) {
            newScore = MAX_REPUTATION_SCORE;
        }
        stats.reputationScore = newScore;

        // Calculate tier
        uint256 newTier;
        if (newScore < 100) {
            newTier = 1;
        } else if (newScore < 500) {
            newTier = 2;
        } else {
            newTier = 3;
        }

        // Update tier if changed
        if (newTier != stats.reputationTier) {
            stats.reputationTier = newTier;
            emit ReputationUpdated(user, newScore, newTier);
        }
    }

    // ============ Token Functions ============
    /**
     *  Generates a token URI

     */
    function _generateTokenURI(
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

    /**
     *  Returns the URI for a token
   
     */
    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        if (!_exists(tokenId)) revert NonExistentToken();
        return _tokenURIs[tokenId];
    }

    /**
     *  Checks if a token exists

     */
    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }

    // ============ View Functions ============
    /**
     *  Gets all campaigns
     */
    function getAllCampaigns() public view returns (Campaign[] memory) {
        return campaigns;
    }

    /**
     *  Gets campaigns with pagination

     */
    function getCampaignsPaginated(
        uint256 startIndex,
        uint256 pageSize
    ) public view returns (Campaign[] memory) {
        // Validate page size
        if (pageSize > MAX_BATCH_SIZE) {
            pageSize = MAX_BATCH_SIZE;
        }

        uint256 endIndex = startIndex + pageSize;
        if (endIndex > campaigns.length) {
            endIndex = campaigns.length;
        }

        Campaign[] memory result = new Campaign[](endIndex - startIndex);
        for (uint256 i = startIndex; i < endIndex; i++) {
            result[i - startIndex] = campaigns[i];
        }
        return result;
    }

    /**
     *  Gets a campaign by ID
   
     */
    function getCampaign(
        uint256 campaignId
    ) public view campaignExists(campaignId) returns (Campaign memory) {
        return campaigns[campaignId];
    }

    /**
     *  Gets all proposals
     */
    function getAllProposals() public view returns (Proposal[] memory) {
        Proposal[] memory allProposals = new Proposal[](proposalCount);
        for (uint256 i = 1; i <= proposalCount; i++) {
            allProposals[i - 1] = proposals[i];
        }
        return allProposals;
    }

    /**
     *  Gets proposals with pagination

     */
    function getProposalsPaginated(
        uint256 startIndex,
        uint256 pageSize
    ) public view returns (Proposal[] memory) {
        // Validate inputs
        if (startIndex > proposalCount) return new Proposal[](0);
        if (pageSize > MAX_BATCH_SIZE) {
            pageSize = MAX_BATCH_SIZE;
        }

        uint256 endIndex = startIndex + pageSize;
        if (endIndex > proposalCount) {
            endIndex = proposalCount;
        }

        Proposal[] memory result = new Proposal[](endIndex - startIndex);
        for (uint256 i = startIndex; i < endIndex; i++) {
            result[i - startIndex] = proposals[i + 1]; // +1 because proposals start at index 1
        }
        return result;
    }

    /**
     *  Gets campaign fund flow
     
     */
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

    /**
     *  Gets campaign analytics
     
     */
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

    /**
     *  Gets user stats
    
     */
    function getUserStats(
        address user
    ) public view validAddress(user) returns (UserStats memory) {
        return userStats[user];
    }

    /**
     *  Gets user campaigns
     * @param user User address
     * @return Array of campaign IDs
     */
    function getUserCampaigns(
        address user
    ) public view validAddress(user) returns (uint256[] memory) {
        return _userCampaigns[user];
    }

    /**
     *  Gets token data
     
     */
    function getTokenData(
        uint256 tokenId
    ) public view returns (uint256 campaignId, uint256 donationAmount) {
        if (!_exists(tokenId)) revert NonExistentToken();
        TokenData memory data = _tokenData[tokenId];
        return (data.campaignId, data.donationAmount);
    }

    /**
     *  Required override for AccessControl and ERC721Enumerable

     */
    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721Enumerable, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}

// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.26;

contract Fundly {
    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        bool paidOut;
        address[] donators;
        uint256[] donations;
    }

    enum VerificationStatus {
        None,
        Pending,
        Verified,
        Rejected
    }

    struct VerificationDocument {
        string documentHash;
        string nameHash;
        VerificationStatus status;
        bool exists;
    }

    mapping(uint256 => Campaign) public campaigns;
    mapping(address => VerificationDocument) public verificationDocuments;

    uint256 public numberOfCampaigns = 0;
    address public owner;

    address[] public verificationRequestsList;

    event VerificationRequested(address indexed user);
    event VerificationStatusChanged(address indexed user, VerificationStatus status);
    event CampaignCreated(uint256 campaignId, address indexed owner, string title);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can call this function");
        _;
    }

    function submitVerificationDocument(string memory _documentHash, string memory _nameHash) public {
        require(
            verificationDocuments[msg.sender].status != VerificationStatus.Verified,
            "User is already verified"
        );
        require(
            verificationDocuments[msg.sender].status != VerificationStatus.Pending,
            "Verification already pending"
        );

        verificationDocuments[msg.sender] = VerificationDocument({
            documentHash: _documentHash,
            nameHash: _nameHash,
            status: VerificationStatus.Pending,
            exists: true
        });

        verificationRequestsList.push(msg.sender);

        emit VerificationRequested(msg.sender);
    }

    function verifyUser(address _user) public  {
        require(
            verificationDocuments[_user].status == VerificationStatus.Pending,
            "User verification is not pending"
        );

        verificationDocuments[_user].status = VerificationStatus.Verified;

        emit VerificationStatusChanged(_user, VerificationStatus.Verified);
    }

  
    function rejectUser(address _user) public  {
        require(
            verificationDocuments[_user].status == VerificationStatus.Pending,
            "User verification is not pending"
        );

        verificationDocuments[_user].status = VerificationStatus.Rejected;

        emit VerificationStatusChanged(_user, VerificationStatus.Rejected);
    }

 
    function isUserVerified(address _user) public view returns (bool) {
        return verificationDocuments[_user].status == VerificationStatus.Verified;
    }

    function getUserVerificationStatus(address _user) public view returns (VerificationStatus) {
        return verificationDocuments[_user].status;
    }

    function getPendingVerificationRequests() public view returns (address[] memory) {
        uint256 count = 0;

     
        for (uint256 i = 0; i < verificationRequestsList.length; i++) {
            if (verificationDocuments[verificationRequestsList[i]].status == VerificationStatus.Pending) {
                count++;
            }
        }

        address[] memory pendingRequests = new address[](count);
        uint256 index = 0;

       
        for (uint256 i = 0; i < verificationRequestsList.length; i++) {
            if (verificationDocuments[verificationRequestsList[i]].status == VerificationStatus.Pending) {
                pendingRequests[index] = verificationRequestsList[i];
                index++;
            }
        }

        return pendingRequests;
    }

    
    function createCampaign(
        address _owner,
        string memory _title,
        string memory _description,
        uint256 _target,
        uint256 _deadline,
        string memory _image
    ) public returns (uint256) {
        Campaign storage campaign = campaigns[numberOfCampaigns];

        require(
            _deadline > block.timestamp,
            "The deadline should be a date in the future."
        );

        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.amountCollected = 0;
        campaign.image = _image;

        numberOfCampaigns++;

        return numberOfCampaigns - 1;
    }


  
    function donateCampaign(uint256 _id) public payable {
        uint256 amount = msg.value;
        Campaign storage campaign = campaigns[_id];

        campaign.donators.push(msg.sender);
        campaign.donations.push(amount);
        campaign.amountCollected += amount;
    }

   
 function payout(uint256 _id) public {
    Campaign storage campaign = campaigns[_id];

    require(msg.sender == campaign.owner, "Only the campaign owner can withdraw funds");
    require(!campaign.paidOut, "Funds already withdrawn");

    uint256 payoutAmount = campaign.amountCollected;
    require(payoutAmount > 0, "No funds to withdraw");

    
    campaign.amountCollected = 0;
    campaign.paidOut = true;

    (bool sent, ) = payable(campaign.owner).call{value: payoutAmount}("");
    require(sent, "Failed to send funds to the campaign owner");
}


    
    function getDonators(uint256 _id) public view returns (address[] memory, uint256[] memory) {
        return (campaigns[_id].donators, campaigns[_id].donations);
    }

 function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);

        for (uint i = 0; i < numberOfCampaigns; i++) {
            Campaign storage item = campaigns[i];
            allCampaigns[i] = item;
        }

        return allCampaigns;
    }
}

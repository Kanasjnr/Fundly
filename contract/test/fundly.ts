import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import type { KYCManager, Fundly } from "../typechain-types";
import type { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("Fundly", () => {
  async function deployFundlyFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const KYCManager = await ethers.getContractFactory("KYCManager");
    const kycManager = await KYCManager.deploy();

    const Fundly = await ethers.getContractFactory("Fundly");
    const fundly = await Fundly.deploy(
      await kycManager.getAddress(),
      ethers.parseEther("100")
    ); // 100 ETH as quorum

    // Add KYC submission for testing addresses
    await kycManager
      .connect(owner)
      .submitKYC("Owner", "owner@example.com", "USA", "123456", "ipfs://owner");
    await kycManager
      .connect(addr1)
      .submitKYC("User1", "user1@example.com", "UK", "234567", "ipfs://user1");
    await kycManager
      .connect(addr2)
      .submitKYC(
        "User2",
        "user2@example.com",
        "Canada",
        "345678",
        "ipfs://user2"
      );

    // Verify KYC for testing addresses
    await kycManager.connect(owner).verifyKYC(await owner.getAddress(), true);
    await kycManager.connect(owner).verifyKYC(await addr1.getAddress(), true);
    await kycManager.connect(owner).verifyKYC(await addr2.getAddress(), true);

    // Fund accounts with ETH for testing
    await owner.sendTransaction({
      to: addr1.address,
      value: ethers.parseEther("100"),
    });
    await owner.sendTransaction({
      to: addr2.address,
      value: ethers.parseEther("100"),
    });

    return { kycManager, fundly, owner, addr1, addr2 };
  }

  describe("KYCManager", () => {
    let kycManager: KYCManager;
    let owner: SignerWithAddress,
      addr1: SignerWithAddress,
      addr2: SignerWithAddress;

    beforeEach(async () => {
      ({ kycManager, owner, addr1, addr2 } = await loadFixture(
        deployFundlyFixture
      ));
    });

    it("Should set the right owner", async () => {
      expect(await kycManager.owner()).to.equal(await owner.getAddress());
    });

    it("Should allow a user to submit KYC", async () => {
      await kycManager
        .connect(addr1)
        .submitKYC(
          "John Doe",
          "john@example.com",
          "USA",
          "123456",
          "ipfs://image"
        );
      const [name, , , , , isVerified] = await kycManager.getUserKYCDetails(
        await addr1.getAddress()
      );
      expect(name).to.equal("John Doe");
      expect(isVerified).to.be.false;
    });

    it("Should not allow submission with empty fields", async () => {
      await expect(
        kycManager
          .connect(addr1)
          .submitKYC("", "john@example.com", "USA", "123456", "ipfs://image")
      ).to.be.revertedWith("Name is required");
    });

    it("Should allow owner to verify KYC", async () => {
      await kycManager
        .connect(addr1)
        .submitKYC(
          "John Doe",
          "john@example.com",
          "USA",
          "123456",
          "ipfs://image"
        );
      await kycManager.connect(owner).verifyKYC(await addr1.getAddress(), true);
      expect(await kycManager.isUserVerified(await addr1.getAddress())).to.be
        .true;
    });

    it("Should not allow non-owner to verify KYC", async () => {
      await kycManager
        .connect(addr1)
        .submitKYC(
          "John Doe",
          "john@example.com",
          "USA",
          "123456",
          "ipfs://image"
        );
      await expect(
        kycManager.connect(addr2).verifyKYC(await addr1.getAddress(), true)
      ).to.be.revertedWithCustomError(kycManager, "OwnableUnauthorizedAccount");
    });

    it("Should return pending verifications", async () => {
      await kycManager
        .connect(addr1)
        .submitKYC(
          "John Doe",
          "john@example.com",
          "USA",
          "123456",
          "ipfs://image"
        );
      await kycManager
        .connect(addr2)
        .submitKYC(
          "Jane Doe",
          "jane@example.com",
          "UK",
          "654321",
          "ipfs://image2"
        );
      const pendingVerifications = await kycManager.getPendingVerifications();
      expect(pendingVerifications).to.have.lengthOf(2);
      expect(pendingVerifications).to.include(await addr1.getAddress());
      expect(pendingVerifications).to.include(await addr2.getAddress());
    });

    it("Should return correct pending verification count", async () => {
      await kycManager
        .connect(addr1)
        .submitKYC(
          "John Doe",
          "john@example.com",
          "USA",
          "123456",
          "ipfs://image"
        );
      await kycManager
        .connect(addr2)
        .submitKYC(
          "Jane Doe",
          "jane@example.com",
          "UK",
          "654321",
          "ipfs://image2"
        );
      expect(await kycManager.getPendingVerificationCount()).to.equal(2);
    });
  });

  describe("Fundly", () => {
    let fundly: Fundly;
    let kycManager: KYCManager;
    let owner: SignerWithAddress,
      addr1: SignerWithAddress,
      addr2: SignerWithAddress;

    beforeEach(async () => {
      ({ fundly, kycManager, owner, addr1, addr2 } = await loadFixture(
        deployFundlyFixture
      ));
    });

    describe("Campaign Management", () => {
      it("Should create a campaign", async () => {
        const tx = await fundly.connect(addr1).createCampaign(
          "Test Campaign",
          "Description",
          ethers.parseEther("10"),
          Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
          "ipfs://image"
        );
        const receipt = await tx.wait();
        const event = receipt?.logs.find(
          (log) => log.eventName === "CampaignCreated"
        );
        expect(event).to.not.be.undefined;
        expect(event?.args?.owner).to.equal(await addr1.getAddress());
        expect(event?.args?.title).to.equal("Test Campaign");
      });

      it("Should not create a campaign if user is not KYC verified", async () => {
        const unverifiedUser = ethers.Wallet.createRandom().connect(
          ethers.provider
        );
        await expect(
          fundly
            .connect(unverifiedUser)
            .createCampaign(
              "Test Campaign",
              "Description",
              ethers.parseEther("10"),
              Math.floor(Date.now() / 1000) + 3600,
              "ipfs://image"
            )
        ).to.be.revertedWith("User is not KYC verified");
      });

      it("Should get campaigns by owner", async () => {
        await fundly
          .connect(addr1)
          .createCampaign(
            "Campaign 1",
            "Description 1",
            ethers.parseEther("10"),
            Math.floor(Date.now() / 1000) + 3600,
            "ipfs://image1"
          );
        await fundly
          .connect(addr1)
          .createCampaign(
            "Campaign 2",
            "Description 2",
            ethers.parseEther("20"),
            Math.floor(Date.now() / 1000) + 7200,
            "ipfs://image2"
          );

        const campaigns = await fundly.getCampaignsByOwner(
          await addr1.getAddress()
        );
        expect(campaigns.length).to.equal(2);
      });
    });

    describe("Donations", () => {
      let campaignId: number;

      beforeEach(async () => {
        const tx = await fundly
          .connect(addr1)
          .createCampaign(
            "Donation Test Campaign",
            "Description",
            ethers.parseEther("10"),
            Math.floor(Date.now() / 1000) + 3600,
            "ipfs://image"
          );
        const receipt = await tx.wait();
        const event = receipt?.logs.find(
          (log) => log.eventName === "CampaignCreated"
        );
        campaignId = event?.args?.campaignId;
      });

      it("Should allow donations to a campaign", async () => {
        const donationAmount = ethers.parseEther("1");
        await expect(
          fundly
            .connect(addr2)
            .donateCampaign(campaignId, { value: donationAmount })
        )
          .to.emit(fundly, "DonationMade")
          .withArgs(campaignId, await addr2.getAddress(), donationAmount);

        const campaign = await fundly.getCampaign(campaignId);
        expect(campaign.amountCollected).to.equal(donationAmount);
      });

      it("Should mint an NFT for the donator", async () => {
        const donationAmount = ethers.parseEther("1");
        await fundly
          .connect(addr2)
          .donateCampaign(campaignId, { value: donationAmount });
        expect(await fundly.balanceOf(await addr2.getAddress())).to.equal(1);
      });
    });

    describe("Campaign Payout", () => {
      let campaignId: number;

      beforeEach(async () => {
        const tx = await fundly
          .connect(addr1)
          .createCampaign(
            "Payout Test Campaign",
            "Description",
            ethers.parseEther("10"),
            Math.floor(Date.now() / 1000) + 3600,
            "ipfs://image"
          );
        const receipt = await tx.wait();
        const event = receipt?.logs.find(
          (log) => log.eventName === "CampaignCreated"
        );
        campaignId = event?.args?.campaignId;

        // Donate to reach the target
        await fundly
          .connect(addr2)
          .donateCampaign(campaignId, { value: ethers.parseEther("10") });
      });

      it("Should allow campaign owner to payout when target is reached", async () => {
        const initialBalance = await ethers.provider.getBalance(
          await addr1.getAddress()
        );
        await expect(fundly.connect(addr1).payoutCampaign(campaignId))
          .to.emit(fundly, "CampaignPaidOut")
          .withArgs(
            campaignId,
            await addr1.getAddress(),
            ethers.parseEther("10")
          );

        const finalBalance = await ethers.provider.getBalance(
          await addr1.getAddress()
        );
        expect(finalBalance - initialBalance).to.be.closeTo(
          ethers.parseEther("10"),
          ethers.parseEther("0.01")
        );
      });

      it("Should not allow non-owner to payout", async () => {
        await expect(
          fundly.connect(addr2).payoutCampaign(campaignId)
        ).to.be.revertedWith("Only the campaign owner can withdraw funds");
      });
    });

    describe("Proposal Management", () => {
      it("Should return correct proposal details", async () => {
        await fundly.connect(addr1).createProposal("Test Proposal", 3600);
        const proposal = await fundly.getProposalDetails(1);
        expect(proposal.id).to.equal(1);
        expect(proposal.description).to.equal("Test Proposal");
        expect(proposal.forVotes).to.equal(0);
        expect(proposal.againstVotes).to.equal(0);
        expect(proposal.executed).to.be.false;
        expect(proposal.quorumReached).to.be.false;
        expect(proposal.passed).to.be.false;
      });

      it("Should not allow voting after the voting period", async () => {
        await fundly.connect(addr1).createProposal("Test Proposal", 1); // 1 second voting period
        await ethers.provider.send("evm_increaseTime", [2]); // Increase time by 2 seconds
        await ethers.provider.send("evm_mine", []);

        await expect(
          fundly.connect(addr2).voteOnProposal(1, true)
        ).to.be.revertedWith("Voting period has ended");
      });

      it("Should not allow unverified user to vote", async () => {
        await fundly.connect(addr1).createProposal("Test Proposal", 3600);
        await kycManager
          .connect(owner)
          .verifyKYC(await addr2.getAddress(), false);
        await expect(
          fundly.connect(addr2).voteOnProposal(1, true)
        ).to.be.revertedWith("User is not KYC verified");
      });

      it("Should not allow double voting", async () => {
        await fundly.connect(addr1).createProposal("Test Proposal", 3600);
        await fundly.connect(addr1).voteOnProposal(1, true);

        await expect(
          fundly.connect(addr1).voteOnProposal(1, true)
        ).to.be.revertedWith("Already voted");
      });

      it("Should execute a proposal when conditions are met", async () => {
        await fundly.connect(addr1).createProposal("Test Proposal", 3600);
        await fundly.connect(addr2).voteOnProposal(1, true);
        await ethers.provider.send("evm_increaseTime", [3601]);
        await ethers.provider.send("evm_mine", []);

        await expect(fundly.connect(addr1).executeProposal(1))
          .to.emit(fundly, "ProposalExecuted")
          .withArgs(1);
      });
    });

    describe("Quorum Management", () => {
      it("Should update quorum votes", async () => {
        const newQuorum = ethers.parseEther("200");
        await fundly.connect(owner).updateQuorumVotes(newQuorum);
        expect(await fundly.quorumVotes()).to.equal(newQuorum);
      });

      it("Should not allow setting quorum to zero", async () => {
        await expect(
          fundly.connect(owner).updateQuorumVotes(0)
        ).to.be.revertedWith("Quorum votes must be greater than 0");
      });
    });
  });
});

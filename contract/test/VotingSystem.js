const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VotingSystem", function () {
    let VotingSystem, votingSystem, owner, user1, user2;
    const MAX_DURATION = 365 * 24 * 60 * 60; // 1 year in seconds

    beforeEach(async function () {
        [owner, user1, user2] = await ethers.getSigners();
        VotingSystem = await ethers.getContractFactory("VotingSystem");
        votingSystem = await VotingSystem.deploy();
    });

    describe("Proposal Creation", function () {
        it("Should allow government (owner) to create a proposal", async function () {
            await expect(
                votingSystem.createProposal("Proposal 1", "Description 1", "Category 1", MAX_DURATION)
            ).to.emit(votingSystem, "ProposalCreated");
        });

        it("Should not allow non-government users to create a proposal", async function () {
            await expect(
                votingSystem.connect(user1).createProposal("Proposal 2", "Description 2", "Category 2", MAX_DURATION)
            ).to.be.revertedWith("Only government can perform this action");
        });
    });

    describe("Voting", function () {
        beforeEach(async function () {
            await votingSystem.createProposal("Proposal 1", "Description 1", "Category 1", MAX_DURATION);
        });

        it("Should allow users to vote on a proposal", async function () {
            await expect(votingSystem.connect(user1).vote(1, true)).to.emit(votingSystem, "Voted");
            await expect(votingSystem.connect(user2).vote(1, false)).to.emit(votingSystem, "Voted");
        });

        it("Should not allow users to vote twice on the same proposal", async function () {
            await votingSystem.connect(user1).vote(1, true);
            await expect(votingSystem.connect(user1).vote(1, false)).to.be.revertedWith("You have already voted");
        });

        it("Should not allow voting after the deadline", async function () {
            await ethers.provider.send("evm_increaseTime", [MAX_DURATION + 1]);
            await ethers.provider.send("evm_mine");
            await expect(votingSystem.connect(user1).vote(1, true)).to.be.revertedWith("Voting period has ended");
        });
    });

    describe("Finalizing Proposals", function () {
        beforeEach(async function () {
            await votingSystem.createProposal("Proposal 1", "Description 1", "Category 1", MAX_DURATION);
            await votingSystem.connect(user1).vote(1, true);
            await votingSystem.connect(user2).vote(1, false);
        });

        it("Should allow government to finalize a proposal after deadline", async function () {
            await ethers.provider.send("evm_increaseTime", [MAX_DURATION + 1]);
            await ethers.provider.send("evm_mine");
            await expect(votingSystem.finalizeProposal(1)).to.emit(votingSystem, "ProposalFinalized");
        });

        it("Should not allow finalizing before deadline", async function () {
            await expect(votingSystem.finalizeProposal(1)).to.be.revertedWith("Voting period is still ongoing");
        });

        it("Should not allow finalizing an already finalized proposal", async function () {
            await ethers.provider.send("evm_increaseTime", [MAX_DURATION + 1]);
            await ethers.provider.send("evm_mine");
            await votingSystem.finalizeProposal(1);
            await expect(votingSystem.finalizeProposal(1)).to.be.revertedWith("Proposal already finalized");
        });
    });

    describe("Fetching Proposals", function () {
        beforeEach(async function () {
            await votingSystem.createProposal("Proposal 1", "Description 1", "Category 1", MAX_DURATION);
        });

        it("Should return correct proposal details", async function () {
            const proposal = await votingSystem.getProposal(1);
            expect(proposal.title).to.equal("Proposal 1");
            expect(proposal.description).to.equal("Description 1");
            expect(proposal.category).to.equal("Category 1");
        });
    });
});

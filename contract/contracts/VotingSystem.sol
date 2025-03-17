// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract VotingSystem {
    struct Proposal {
        uint256 id;
        string title;
        string description;
        string category;
        uint256 deadline;
        uint256 upvotes;
        uint256 downvotes;
        bool finalized;
        address proposer;
    }

    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    uint256 public proposalCount;
    address public government;

    event ProposalCreated(
        uint256 indexed id,
        string title,
        string description,
        string category,
        uint256 deadline,
        address proposer
    );

    event Voted(uint256 indexed proposalId, address indexed voter, bool voteType);
    event ProposalFinalized(uint256 indexed proposalId, string result);

    modifier onlyGovernment() {
        require(msg.sender == government, "Only government can perform this action");
        _;
    }

    modifier validProposal(uint256 proposalId) {
        require(proposalId > 0 && proposalId <= proposalCount, "Proposal does not exist");
        _;
    }

    constructor() {
        government = msg.sender;
        proposalCount = 0;
    }

    function createProposal(
        string memory _title,
        string memory _description,
        string memory _category,
        uint256 _duration
    ) public onlyGovernment {
        proposalCount++;
        uint256 deadline = block.timestamp + _duration;

        proposals[proposalCount] = Proposal({
            id: proposalCount,
            title: _title,
            description: _description,
            category: _category,
            deadline: deadline,
            upvotes: 0,
            downvotes: 0,
            finalized: false,
            proposer: msg.sender
        });

        emit ProposalCreated(proposalCount, _title, _description, _category, deadline, msg.sender);
    }

    function vote(uint256 proposalId, bool voteType) public validProposal(proposalId) {
        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp < proposal.deadline, "Voting period has ended");
        require(!hasVoted[proposalId][msg.sender], "You have already voted");

        hasVoted[proposalId][msg.sender] = true;
        
        if (voteType) {
            proposal.upvotes++;
        } else {
            proposal.downvotes++;
        }

        emit Voted(proposalId, msg.sender, voteType);
    }

    function finalizeProposal(uint256 proposalId) public onlyGovernment validProposal(proposalId) {
        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp >= proposal.deadline, "Voting period is still ongoing");
        require(!proposal.finalized, "Proposal already finalized");

        proposal.finalized = true;
        string memory result = proposal.upvotes > proposal.downvotes ? "Accepted" : "Rejected";

        emit ProposalFinalized(proposalId, result);
    }

    function getProposal(uint256 proposalId) public view validProposal(proposalId) returns (
        string memory title,
        string memory description,
        string memory category,
        uint256 deadline,
        uint256 upvotes,
        uint256 downvotes,
        bool finalized
    ) {
        Proposal memory proposal = proposals[proposalId];
        return (
            proposal.title,
            proposal.description,
            proposal.category,
            proposal.deadline,
            proposal.upvotes,
            proposal.downvotes,
            proposal.finalized
        );
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract VotingSystem {
    struct Proposal {
        uint256 id;
        string title;
        string description;
        string category;
        uint256 deadline;
        uint256 createdAt;
        uint256 upvotes;
        uint256 downvotes;
        bool finalized;
        address proposer;
    }

    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    uint256 public proposalCount;
    address public government;
    uint256 public constant MAX_DURATION = 365 days; // Maximum voting duration

    event ProposalCreated(
        uint256 indexed id,
        string title,
        string description,
        string category,
        uint256 deadline,
        uint256 createdAt,
        address proposer
    );

    event Voted(uint256 indexed proposalId, address indexed voter, bool voteType);
    event ProposalFinalized(uint256 indexed proposalId, bool result);

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
        require(_duration > 0 && _duration <= MAX_DURATION, "Invalid duration");
        require(bytes(_title).length > 0 && bytes(_title).length <= 256, "Title length must be between 1 and 256");
        require(bytes(_description).length > 0 && bytes(_description).length <= 1024, "Description length must be between 1 and 1024");
        require(bytes(_category).length > 0 && bytes(_category).length <= 128, "Category length must be between 1 and 128");

        proposalCount++;
        uint256 deadline = block.timestamp + _duration;

        proposals[proposalCount] = Proposal({
            id: proposalCount,
            title: _title,
            description: _description,
            category: _category,
            deadline: deadline,
            createdAt: block.timestamp,
            upvotes: 0,
            downvotes: 0,
            finalized: false,
            proposer: msg.sender
        });

        emit ProposalCreated(proposalCount, _title, _description, _category, deadline, block.timestamp, msg.sender);
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
        bool result = proposal.upvotes > proposal.downvotes;

        emit ProposalFinalized(proposalId, result);
    }

    function getProposal(uint256 proposalId) public view validProposal(proposalId) returns (
        string memory title,
        string memory description,
        string memory category,
        uint256 deadline,
        uint256 createdAt,
        uint256 upvotes,
        uint256 downvotes,
        bool finalized,
        address proposer
    ) {
        Proposal memory proposal = proposals[proposalId];
        return (
            proposal.title,
            proposal.description,
            proposal.category,
            proposal.deadline,
            proposal.createdAt,
            proposal.upvotes,
            proposal.downvotes,
            proposal.finalized,
            proposal.proposer
        );
    }
}
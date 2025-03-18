"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Code,
  FileText,
  Vote,
  CheckCircle,
  Shield,
  Lock,
  ArrowRight,
  Users,
  Clock,
  Zap,
  Database,
  Key,
  RefreshCw,
  BarChart2,
} from "lucide-react"

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-12 sm:py-20 overflow-hidden bg-gradient-to-b from-purple-50 to-white dark:from-purple-950/30 dark:to-background">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
        </div>
        
        <div className="container relative z-10 px-4 sm:px-6">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="mx-auto max-w-3xl text-center"
          >
            <Badge className="mb-4">Technical Overview</Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              How Our <span className="text-purple-600 dark:text-purple-400">Blockchain Contract</span> Works
            </h1>
            <p className="text-base sm:text-xl text-muted-foreground mb-8">
              A deep dive into the technology powering ChainDemocracy's transparent and secure voting system.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/proposals">
                  <Vote className="mr-2 h-5 w-5" />
                  Try Voting
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="https://github.com/example/chain-democracy" target="_blank" rel="noopener noreferrer">
                  <Code className="mr-2 h-5 w-5" />
                  View Source Code
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Contract Overview Section */}
      <section className="py-12 sm:py-20">
        <div className="container px-4 sm:px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="mx-auto max-w-3xl text-center mb-12 sm:mb-16"
          >
            <Badge className="mb-4">Contract Overview</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight md:text-4xl mb-4">
              The Architecture of Decentralized Governance
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              Our smart contract is built on Ethereum and designed with security, transparency, and efficiency in mind.
            </p>
          </motion.div>
          
          <div className="flex flex-col gap-12 justify-center items-center">
          {/* Code Box Section - Full width on all devices */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full"
          >
            <div className="relative w-full mx-auto">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-tr from-purple-600 to-pink-500 blur-xl opacity-20" />
              <Card className="relative border-2 border-purple-200 dark:border-purple-900 overflow-hidden">
                <CardContent className="p-0">
                  <pre className="overflow-x-auto p-4 sm:p-6 text-xs sm:text-sm bg-slate-950 text-slate-50 rounded-lg">
                    <code>{`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

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

    address public government;
    uint256 public proposalCount;
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    event ProposalCreated(
        uint256 indexed id,
        string title,
        string description,
        string category,
        uint256 deadline,
        address proposer
    );

    event Voted(
        uint256 indexed proposalId,
        address indexed voter,
        bool voteType
    );

    event ProposalFinalized(
        uint256 indexed proposalId,
        string result
    );

    constructor() {
        government = msg.sender;
    }

    function createProposal(
        string memory _title,
        string memory _description,
        string memory _category,
        uint256 _duration
    ) public {
        require(msg.sender == government, "Only government can create proposals");
        
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
        
        emit ProposalCreated(
            proposalCount,
            _title,
            _description,
            _category,
            deadline,
            msg.sender
        );
    }

    function vote(uint256 proposalId, bool voteType) public {
        Proposal storage proposal = proposals[proposalId];
        
        require(proposal.id > 0, "Proposal does not exist");
        require(!proposal.finalized, "Proposal already finalized");
        require(block.timestamp < proposal.deadline, "Voting period has ended");
        require(!hasVoted[proposalId][msg.sender], "Already voted");
        
        hasVoted[proposalId][msg.sender] = true;
        
        if (voteType) {
            proposal.upvotes++;
        } else {
            proposal.downvotes++;
        }
        
        emit Voted(proposalId, msg.sender, voteType);
    }

    function finalizeProposal(uint256 proposalId) public {
        Proposal storage proposal = proposals[proposalId];
        
        require(proposal.id > 0, "Proposal does not exist");
        require(!proposal.finalized, "Proposal already finalized");
        require(block.timestamp >= proposal.deadline, "Voting period not ended");
        
        proposal.finalized = true;
        
        string memory result = proposal.upvotes > proposal.downvotes ? "Accepted" : "Rejected";
        
        emit ProposalFinalized(proposalId, result);
    }

    function getProposal(uint256 proposalId) public view returns (
        string memory title,
        string memory description,
        string memory category,
        uint256 deadline,
        uint256 upvotes,
        uint256 downvotes,
        bool finalized
    ) {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.id > 0, "Proposal does not exist");
        
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
}`}</code>
                  </pre>
                </CardContent>
              </Card>
            </div>
          </motion.div>
          
          {/* Features Section - Always below the code box */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full"
          >
            <h3 className="text-2xl font-bold mb-6 text-center sm:text-left">Smart Contract Structure</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Database className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold">Data Storage</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Our contract uses efficient data structures to store proposals, votes, and user participation records.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Key className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold">Access Control</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Role-based permissions ensure only authorized entities can create proposals, while anyone can vote.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Clock className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold">Time-Based Logic</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Each proposal has a deadline, after which votes can no longer be cast and results can be finalized.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Zap className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold">Events</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    The contract emits events for proposal creation, voting, and finalization, enabling efficient off-chain tracking.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="container px-4 sm:px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="mx-auto max-w-3xl text-center mb-16"
          >
            <Badge className="mb-4">Process Flow</Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              The Lifecycle of a Proposal
            </h2>
            <p className="text-lg text-muted-foreground">
              From creation to finalization, here's how proposals move through our system.
            </p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="relative max-w-4xl mx-auto"
          >
            {/* Update the timeline line to be responsive */}
            <div className="absolute left-4 sm:left-16 top-0 h-full w-0.5 bg-purple-200 dark:bg-purple-900 hidden sm:block" />
            
            {[
              {
                icon: FileText,
                title: "Proposal Creation",
                description: "The government account creates a new proposal with a title, description, category, and voting duration.",
                code: "function createProposal(string memory _title, string memory _description, string memory _category, uint256 _duration)"
              },
              {
                icon: Vote,
                title: "Voting Period",
                description: "Citizens can cast their votes (for or against) until the proposal deadline. Each address can only vote once per proposal.",
                code: "function vote(uint256 proposalId, bool voteType)"
              },
              {
                icon: Clock,
                title: "Deadline Reached",
                description: "Once the deadline is reached, no more votes can be cast. The proposal awaits finalization.",
                code: "require(block.timestamp < proposal.deadline, 'Voting period has ended')"
              },
              {
                icon: CheckCircle,
                title: "Proposal Finalization",
                description: "After the deadline, the proposal can be finalized, determining whether it was accepted or rejected based on vote counts.",
                code: "function finalizeProposal(uint256 proposalId)"
              },
              {
                icon: RefreshCw,
                title: "Result Implementation",
                description: "Once finalized, the result is recorded on the blockchain permanently and can be implemented by the governing body.",
                code: "emit ProposalFinalized(proposalId, result)"
              }
            ].map((step, index) => (
              <motion.div key={index} variants={fadeIn} className="relative mb-12 pl-12 sm:ml-16 sm:pl-12">
                <div className="absolute left-0 top-0 -ml-4 sm:-ml-8 flex h-8 w-8 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30 border border-purple-300 dark:border-purple-800">
                  <step.icon className="h-4 w-4 sm:h-8 sm:w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="rounded-lg border bg-card p-4 sm:p-6 shadow-sm">
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-4">{step.description}</p>
                  <div className="overflow-x-auto">
                    <pre className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md text-xs sm:text-sm">
                      <code>{step.code}</code>
                    </pre>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Technical Features Section */}
      <section className="py-8 sm:py-12 md:py-20">
  <div className="container px-4 sm:px-6">
    <div 
      className="mx-auto max-w-3xl text-center mb-8 sm:mb-12 md:mb-16"
    >
      <Badge className="mb-3 md:mb-4">Technical Features</Badge>
      <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-3 md:mb-4">
        Key Components of Our Blockchain Solution
      </h2>
      <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
        Explore the technical features that make our voting system secure, transparent, and efficient.
      </p>
    </div>
    
    <Tabs defaultValue="security" className="max-w-4xl mx-auto">
      <TabsList className="flex flex-col sm:grid sm:grid-cols-3 w-full gap-2 sm:gap-0">
        <TabsTrigger value="security" className="text-sm md:text-base">Security</TabsTrigger>
        <TabsTrigger value="transparency" className="text-sm md:text-base">Transparency</TabsTrigger>
        <TabsTrigger value="efficiency" className="text-sm md:text-base">Efficiency</TabsTrigger>
      </TabsList>
      <TabsContent value="security" className="mt-4 md:mt-6">
        <Card>
          <CardHeader className="px-4 py-3 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
              Security Features
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              How we ensure the integrity and security of the voting process
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-4 sm:p-6 space-y-3 sm:space-y-4">
            <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
              <div className="space-y-1 sm:space-y-2">
                <h4 className="font-semibold text-sm sm:text-base">One Vote Per Address</h4>
                <p className="text-xs text-muted-foreground">
                  Our contract uses a mapping to track which addresses have voted on each proposal, preventing double voting.
                </p>
                <div className="overflow-x-auto">
                  <pre className="bg-slate-100 dark:bg-slate-800 p-1 sm:p-2 rounded-md text-xs overflow-x-auto">
                    <code className="overflow-scroll">mapping(uint256 =&gt; mapping(address =&gt; bool)) public hasVoted;</code>
                  </pre>
                </div>
              </div>
              
              <div className="space-y-1 sm:space-y-2">
                <h4 className="font-semibold text-sm sm:text-base">Time-Locked Voting</h4>
                <p className="text-xs text-muted-foreground">
                  Votes can only be cast during the designated voting period, enforced by blockchain timestamps.
                </p>
                <div className="overflow-x-auto">
                  <pre className="bg-slate-100 dark:bg-slate-800 p-1 sm:p-2 rounded-md text-xs overflow-x-auto">
                    <code className="overflow-scroll">{"require(block.timestamp < proposal.deadline, Voting period has ended);"}</code>
                  </pre>
                </div>
              </div>
              
              <div className="space-y-1 sm:space-y-2">
                <h4 className="font-semibold text-sm sm:text-base">Role-Based Access Control</h4>
                <p className="text-xs text-muted-foreground">
                  Only authorized addresses can create proposals or perform administrative functions.
                </p>
                <div className="overflow-x-auto">
                  <pre className="bg-slate-100 dark:bg-slate-800 p-1 sm:p-2 rounded-md text-xs overflow-x-auto">
                    <code className="overflow-scroll">require(msg.sender == government, "Only government can create proposals");</code>
                  </pre>
                </div>
              </div>
              
              <div className="space-y-1 sm:space-y-2">
                <h4 className="font-semibold text-sm sm:text-base">Immutable Vote Records</h4>
                <p className="text-xs text-muted-foreground">
                  Once cast, votes cannot be changed or removed, ensuring the integrity of the voting process.
                </p>
                <div className="overflow-x-auto">
                  <pre className="bg-slate-100 dark:bg-slate-800 p-1 sm:p-2 rounded-md text-xs overflow-x-auto">
                    <code className="overflow-scroll">emit Voted(proposalId, msg.sender, voteType);</code>
                  </pre>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="transparency" className="mt-4 md:mt-6">
        <Card>
          <CardHeader className="px-4 py-3 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
              Transparency Features
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              How we ensure complete visibility into the voting process
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-4 sm:p-6 space-y-3 sm:space-y-4">
            <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
              <div className="space-y-1 sm:space-y-2">
                <h4 className="font-semibold text-sm sm:text-base">Public Vote Counts</h4>
                <p className="text-xs text-muted-foreground">
                  All vote counts are stored publicly on the blockchain and can be queried by anyone.
                </p>
                <div className="overflow-x-auto">
                  <pre className="bg-slate-100 dark:bg-slate-800 p-1 sm:p-2 rounded-md text-xs overflow-x-auto">
                    <code>uint256 upvotes; uint256 downvotes;</code>
                  </pre>
                </div>
              </div>
              
              <div className="space-y-1 sm:space-y-2">
                <h4 className="font-semibold text-sm sm:text-base">Transparent Proposal Creation</h4>
                <p className="text-xs text-muted-foreground">
                  All proposal details, including creator, are publicly visible and cannot be altered after creation.
                </p>
                <div className="overflow-x-auto">
                  <pre className="bg-slate-100 dark:bg-slate-800 p-1 sm:p-2 rounded-md text-xs overflow-x-auto">
                    <code>emit ProposalCreated(proposalCount, _title, _description, _category, deadline, msg.sender);</code>
                  </pre>
                </div>
              </div>
              
              <div className="space-y-1 sm:space-y-2">
                <h4 className="font-semibold text-sm sm:text-base">Verifiable Voting Events</h4>
                <p className="text-xs text-muted-foreground">
                  Each vote emits an event that can be tracked and verified by external systems.
                </p>
                <div className="overflow-x-auto">
                  <pre className="bg-slate-100 dark:bg-slate-800 p-1 sm:p-2 rounded-md text-xs overflow-x-auto">
                    <code>event Voted(uint256 indexed proposalId, address indexed voter, bool voteType);</code>
                  </pre>
                </div>
              </div>
              
              <div className="space-y-1 sm:space-y-2">
                <h4 className="font-semibold text-sm sm:text-base">Public Result Determination</h4>
                <p className="text-xs text-muted-foreground">
                  The logic for determining proposal outcomes is transparent and consistent.
                </p>
                <div className="overflow-x-auto">
                  <pre className="bg-slate-100 dark:bg-slate-800 p-1 sm:p-2 rounded-md text-xs overflow-x-auto">
                    <code>{"string memory result = proposal.upvotes > proposal.downvotes ? Accepted : Rejected;"}</code>
                  </pre>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="efficiency" className="mt-4 md:mt-6">
        <Card>
          <CardHeader className="px-4 py-3 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
              Efficiency Features
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              How we optimize for gas costs and performance
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-4 sm:p-6 space-y-3 sm:space-y-4">
            <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
              <div className="space-y-1 sm:space-y-2">
                <h4 className="font-semibold text-sm sm:text-base">Optimized Data Structures</h4>
                <p className="text-xs text-muted-foreground">
                  We use mappings instead of arrays for O(1) lookups, reducing gas costs for high-volume operations.
                </p>
                <div className="overflow-x-auto">
                  <pre className="bg-slate-100 dark:bg-slate-800 p-1 sm:p-2 rounded-md text-xs overflow-x-auto">
                    <code>{"mapping(uint256 => Proposal) public proposals;"}</code>
                  </pre>
                </div>
              </div>
              
              <div className="space-y-1 sm:space-y-2">
                <h4 className="font-semibold text-sm sm:text-base">Minimal Storage Usage</h4>
                <p className="text-xs text-muted-foreground">
                  We carefully design our data structures to minimize on-chain storage requirements.
                </p>
                <div className="overflow-x-auto">
                  <pre className="bg-slate-100 dark:bg-slate-800 p-1 sm:p-2 rounded-md text-xs overflow-x-auto">
                    <code>bool hasVoted; // Uses only 1 bit of storage</code>
                  </pre>
                </div>
              </div>
              
              <div className="space-y-1 sm:space-y-2">
                <h4 className="font-semibold text-sm sm:text-base">Efficient Vote Counting</h4>
                <p className="text-xs text-muted-foreground">
                  Votes are tallied in real-time, eliminating the need for expensive counting operations.
                </p>
                <div className="overflow-x-auto">
                  <pre className="bg-slate-100 dark:bg-slate-800 p-1 sm:p-2 rounded-md text-xs overflow-x-auto">
                    <code>{"if (voteType) { proposal.upvotes++; } else { proposal.downvotes++; }"}</code>
                  </pre>
                </div>
              </div>
              
              <div className="space-y-1 sm:space-y-2">
                <h4 className="font-semibold text-sm sm:text-base">Event-Based Architecture</h4>
                <p className="text-xs text-muted-foreground">
                  We use events for off-chain tracking, reducing the need for expensive on-chain queries.
                </p>
                <div className="overflow-x-auto">
                  <pre className="bg-slate-100 dark:bg-slate-800 p-1 sm:p-2 rounded-md text-xs overflow-x-auto">
                    <code>emit ProposalFinalized(proposalId, result);</code>
                  </pre>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</section>
      
      {/* Integration Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-purple-600 text-white">
  <div className="container px-4 sm:px-6">
    <div className="grid gap-8 sm:gap-12 lg:grid-cols-2 items-center">
      <div 
        className="order-2 lg:order-1"
      >
        <Badge className="bg-white/20 text-white hover:bg-white/30 mb-3 sm:mb-4">Integration</Badge>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mb-3 sm:mb-4">
          Seamlessly Integrate with Our Contract
        </h2>
        <p className="text-sm sm:text-base md:text-xl opacity-90 mb-4 sm:mb-6">
          Our smart contract is designed to be easily integrated with your existing systems and applications.
        </p>
        <div className="space-y-3 sm:space-y-4">
          <div className="flex gap-3 sm:gap-4">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
              <Code className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-semibold">Simple API</h4>
              <p className="text-xs sm:text-sm md:text-base opacity-90">
                Our contract exposes a clean, well-documented API for easy integration.
              </p>
            </div>
          </div>
          
          <div className="flex gap-3 sm:gap-4">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
              <Users className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-semibold">Multi-Platform Support</h4>
              <p className="text-xs sm:text-sm md:text-base opacity-90">
                Integrate with web, mobile, or desktop applications using standard Web3 libraries.
              </p>
            </div>
          </div>
          
          <div className="flex gap-3 sm:gap-4">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-semibold">Comprehensive Documentation</h4>
              <p className="text-xs sm:text-sm md:text-base opacity-90">
                Detailed guides and examples to help you integrate quickly and securely.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 sm:mt-8">
          <Button size="sm" className="sm:text-base sm:py-2" variant="secondary" asChild>
            <Link href="/dashboard">
              Explore Dashboard
              <ArrowRight className="ml-1 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </Button>
        </div>
      </div>
      
      <div 
        className="relative mx-auto order-1 lg:order-2 px-1"
      >
        <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto">
          <div className="absolute inset-0 rounded-lg bg-white/10 blur-xl opacity-30" />
          <Card className="relative border-0 overflow-hidden bg-white/10 backdrop-blur-sm">
            <CardHeader className="px-3 sm:px-6 py-3 sm:py-4">
              <CardTitle className="text-base sm:text-lg text-white">Integration Example</CardTitle>
              <CardDescription className="text-xs sm:text-sm text-white/70">
                Connect to our contract with ethers.js
              </CardDescription>
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
              <div className="overflow-x-auto">
                <pre className="bg-slate-900/80 p-2 sm:p-4 rounded-md text-xs overflow-x-auto text-slate-100">
                  <code>{`import { ethers } from "ethers";
import { VotingSystemABI } from "./abi";

// Connect to the contract
const connectToContract = async () => {
  // Initialize provider
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  // Contract address
  const contractAddress = "0x...";

  // Create contract instance
  const contract = new ethers.Contract(
    contractAddress,
    VotingSystemABI,
    signer
  );

  return contract;
};

// Vote on a proposal
const voteOnProposal = async (proposalId, voteType) => {
  const contract = await connectToContract();

  try {
    const tx = await contract.vote(proposalId, voteType);
    await tx.wait();
    console.log("Vote submitted successfully!");
    return true;
  } catch (error) {
    console.error("Error voting:", error);
    return false;
  }
};`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
</section>
      
      {/* CTA Section */}
      <section className="py-12 sm:py-20">
        <div className="container px-4 sm:px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="mx-auto max-w-3xl text-center"
          >
            <Badge className="mb-4">Get Started</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight md:text-4xl mb-4">
              Ready to Experience Decentralized Governance?
            </h2>
            <p className="text-base sm:text-xl text-muted-foreground mb-8">
              Try our platform today and see how blockchain technology can transform democratic processes.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/proposals">
                  <Vote className="mr-2 h-5 w-5" />
                  Browse Proposals
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/dashboard">
                  <BarChart2 className="mr-2 h-5 w-5" />
                  View Dashboard
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}


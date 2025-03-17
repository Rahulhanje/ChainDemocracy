"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { ProposalCard } from "@/components/proposal-card"
import { ProposalFilters } from "@/components/proposal-filters"
import { CreateProposalDialog } from "@/components/create-proposal-dialog"
import { Button } from "@/components/ui/button"
import { Loader2, AlertCircle } from "lucide-react"
import { useWallet } from "@/hooks/WalletContext"
import { getContract } from "@/lib/contract"

interface Proposal {
    id: number
    title: string
    description: string
    category: string
    deadline: number
    upvotes: number
    downvotes: number
    finalized: boolean
}

export default function ProposalsPage() {
    const { isConnected } = useWallet()
    const [proposals, setProposals] = useState<Proposal[]>([])
    const [filteredProposals, setFilteredProposals] = useState<Proposal[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [count, setCount] = useState(0)
    const [filters, setFilters] = useState({
        search: "",
        category: "All Categories",
        status: "All",
        sort: "newest",
    })
    const [contract, setContract] = useState<ethers.Contract | null>(null);

    async function initializeContract() {
        const contractInstance = await getContract();
        const c= await contractInstance.proposalCount();
        setCount(c);
        setContract(contractInstance);
    }

    const fetchProposals = async () => {
        const totalProposals =count ; // Change this to the actual count
        const proposals: Proposal[] = [];
        for (let id = 1; id <= totalProposals; id++) {
          try {
            if (!contract) {
                console.error("Contract is not initialized");
                return;
            }
            const proposal = await contract.getProposal(id);
            const formattedProposal = {
              id: id,
              title: proposal[0],
              description: proposal[1],
              category: proposal[2],
              deadline: Number(proposal[3]),
              upvotes: Number(proposal[4]),
              downvotes: Number(proposal[5]),
              finalized: proposal[6],
            };
             proposals.push(formattedProposal);
            console.log(`Proposal ID ${id}:`, formattedProposal);
          } catch (error) {
            console.error(`Error fetching proposal ID ${id}:`, error);
          }
        }
        console.log("Fetched proposals:", proposals);
        setProposals(proposals);
        setIsLoading(false);
        
      };

    useEffect(() => {
        initializeContract();
    }, []);

    useEffect(() => {
        const fetchContractData = async () => {
            if (contract) {
                await fetchProposals();
            }
        };

        if (contract) {
            fetchContractData();
        }
    }, [contract]);

    useEffect(() => {
        // Apply filters and sorting
        let result = [...proposals]

        // Apply search filter
        if (filters.search) {
            const searchLower = filters.search.toLowerCase()
            result = result.filter(
                (proposal) =>
                    proposal.title.toLowerCase().includes(searchLower) ||
                    proposal.description.toLowerCase().includes(searchLower),
            )
        }

        // Apply category filter
        if (filters.category !== "All Categories") {
            result = result.filter((proposal) => proposal.category === filters.category)
        }

        // Apply status filter
        if (filters.status !== "All") {
            const now = Math.floor(Date.now() / 1000)

            switch (filters.status) {
                case "Active":
                    result = result.filter((proposal) => !proposal.finalized && proposal.deadline > now)
                    break
                case "Accepted":
                    result = result.filter((proposal) => proposal.finalized && proposal.upvotes > proposal.downvotes)
                    break
                case "Rejected":
                    result = result.filter((proposal) => proposal.finalized && proposal.upvotes <= proposal.downvotes)
                    break
                case "Pending":
                    result = result.filter((proposal) => !proposal.finalized && proposal.deadline <= now)
                    break
            }
        }

        // Apply sorting
        switch (filters.sort) {
            case "newest":
                result.sort((a, b) => b.id - a.id)
                break
            case "oldest":
                result.sort((a, b) => a.id - b.id)
                break
            case "most-votes":
                result.sort((a, b) => b.upvotes + b.downvotes - (a.upvotes + a.downvotes))
                break
            case "ending-soon":
                const now = Math.floor(Date.now() / 1000)
                result = result
                    .filter((proposal) => !proposal.finalized && proposal.deadline > now)
                    .sort((a, b) => a.deadline - b.deadline)
                break
        }

        setFilteredProposals(result)
    }, [proposals, filters])

    const handleFilterChange = (newFilters: {
        search: string
        category: string
        status: string
        sort: string
    }) => {
        setFilters(newFilters)
    }

    return (
        <div className="container py-8">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Proposals</h1>
                    <p className="text-muted-foreground">Browse and vote on active proposals or view past results</p>
                </div>
                <CreateProposalDialog />
            </div>

            <div className="mb-8">
                <ProposalFilters onFilterChange={handleFilterChange} />
            </div>

            {isLoading ? (
                <div className="flex h-[400px] items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-muted-foreground">Loading proposals...</p>
                    </div>
                </div>
            ) : error ? (
                <div className="flex h-[400px] items-center justify-center">
                    <div className="flex flex-col items-center gap-2 text-center">
                        <AlertCircle className="h-8 w-8 text-destructive" />
                        <p className="font-medium text-destructive">{error}</p>
                        <Button variant="outline" onClick={fetchProposals} className="mt-2">
                            Try Again
                        </Button>
                    </div>
                </div>
            ) : filteredProposals.length === 0 ? (
                <div className="flex h-[400px] items-center justify-center">
                    <div className="flex flex-col items-center gap-2 text-center max-w-md">
                        <p className="text-lg font-medium">No proposals found</p>
                        <p className="text-muted-foreground">
                            {filters.search || filters.category !== "All Categories" || filters.status !== "All"
                                ? "Try adjusting your filters to see more results."
                                : "There are no proposals available at this time."}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                    {filteredProposals.map((proposal) => (
                        <ProposalCard key={proposal.id} proposal={proposal} />
                    ))}
                    
                </div>
            )}

        </div>
    )
}
"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { CountdownTimer } from "@/components/countdown-timer"
import { VotingProgress } from "@/components/voting-progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Tag,
  Calendar,
  User,
  ThumbsUp,
  ThumbsDown,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { useWallet } from "@/hooks/WalletContext"
import { getAllProposals, getContract } from "@/lib/contract"

interface Proposal {
  id: number
  title: string
  description: string
  category: string
  deadline: number
  upvotes: number
  downvotes: number
  finalized: boolean
  proposer: string
}

export default async function ProposalDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { isConnected, account } = useWallet()
  const contract=await getContract();
  //

  const isGovernment=true;
  const [proposal, setProposal] = useState<Proposal | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isVoting, setIsVoting] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)
  const [voteError, setVoteError] = useState<string | null>(null)
  const [isFinalizing, setIsFinalizing] = useState(false)
  const [finalizeError, setFinalizeError] = useState<string | null>(null)

  const proposalId = Number(params.id)
  const isExpired = proposal ? proposal.deadline * 1000 < Date.now() : false
  const totalVotes = proposal ? proposal.upvotes + proposal.downvotes : 0
  const result = proposal && proposal.upvotes > proposal.downvotes ? "Accepted" : "Rejected"

  const fetchProposal = async () => {
    if (!contract) return

    try {
      setIsLoading(true)
      setError(null)

      // Check if the proposal exists
      const count = await contract.proposalCount()
      if (proposalId <= 0 || proposalId > count) {
        setError("Proposal not found")
        return
      }

      // Get proposal details
      const proposalData = await getAllProposals();
      const proposal = proposalData.find((p) => p.id === proposalId) as Proposal
      if (!proposal) {
        setError("Proposal not found")
        return
      }
      setProposal(proposal)

      // Check if the user has already voted
      if (account) {
        const voted = await contract.hasVoted(proposalId, account)
        setHasVoted(voted)
      }
    } catch (error: any) {
      console.error("Error fetching proposal:", error)
      setError("Failed to load proposal details. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (contract) {
      fetchProposal()
    }
  }, [contract, proposalId, account])

  const handleVote = async (voteType: boolean) => {
    if (!isConnected || !contract || !proposal || isExpired || proposal.finalized) return

    try {
      setIsVoting(true)
      setVoteError(null)

      const tx = await contract.vote(proposalId, voteType)
      await tx.wait()

      setHasVoted(true)
      fetchProposal() // Refresh data
    } catch (error: any) {
      console.error("Error voting:", error)
      setVoteError(error.message || "Failed to vote. You may have already voted.")
    } finally {
      setIsVoting(false)
    }
  }

  const handleFinalize = async () => {
    if (!isConnected || !contract || !proposal || !isGovernment || !isExpired || proposal.finalized) return

    try {
      setIsFinalizing(true)
      setFinalizeError(null)

      const tx = await contract.finalizeProposal(proposalId)
      await tx.wait()

      fetchProposal() // Refresh data
    } catch (error: any) {
      console.error("Error finalizing proposal:", error)
      setFinalizeError(error.message || "Failed to finalize proposal.")
    } finally {
      setIsFinalizing(false)
    }
  }

  // For demo purposes, if no contract is available, show sample data
  useEffect(() => {
    if (!contract && isLoading) {
      // Sample data for demonstration
      const sampleProposal: Proposal = {
        id: proposalId,
        title: "City Park Renovation Project",
        description:
          "Proposal to renovate the central city park with new playground equipment, walking paths, and landscaping to create a more accessible and enjoyable space for all residents.\n\nThe renovation will include:\n\n- New playground equipment suitable for children of all abilities\n- Expanded walking paths with improved accessibility\n- Additional seating areas and picnic facilities\n- Native plant landscaping to support local wildlife\n- Improved lighting for evening safety\n- Water-efficient irrigation systems\n\nThis project aims to create a more inclusive community space that can be enjoyed by residents of all ages and abilities. The renovated park will provide recreational opportunities, promote physical activity, and serve as a gathering place for community events.",
        category: "Environment",
        deadline: Math.floor(Date.now() / 1000) + 86400 * 3, // 3 days from now
        upvotes: 156,
        downvotes: 23,
        finalized: false,
        proposer: "0x1234567890123456789012345678901234567890",
      }

      setProposal(sampleProposal)
      setIsLoading(false)
    }
  }, [contract, isLoading, proposalId])

  const getCategoryIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case "finance":
        return "💰"
      case "governance":
        return "⚖️"
      case "technology":
        return "💻"
      case "social":
        return "👥"
      case "environment":
        return "🌱"
      case "education":
        return "📚"
      case "health":
        return "🏥"
      default:
        return "📋"
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="container py-8">
      <Button variant="ghost" asChild className="mb-6 flex items-center gap-2">
        <Link href="/proposals">
          <ArrowLeft className="h-4 w-4" />
          Back to Proposals
        </Link>
      </Button>

      {isLoading ? (
        <div className="flex h-[400px] items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading proposal details...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex h-[400px] items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <p className="font-medium text-destructive">{error}</p>
            <Button variant="outline" onClick={() => router.push("/proposals")} className="mt-2">
              Return to Proposals
            </Button>
          </div>
        </div>
      ) : proposal ? (
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                <span>
                  {getCategoryIcon(proposal.category)} {proposal.category}
                </span>
              </Badge>
              {proposal.finalized ? (
                <Badge variant={result === "Accepted" ? "default" : "destructive"} className={`flex items-center gap-1 ${result === "Accepted" ? "bg-green-500 text-white" : ""}`}>
                  {result === "Accepted" ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                  <span>{result}</span>
                </Badge>
              ) : isExpired ? (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>Pending Finalization</span>
                </Badge>
              ) : null}
            </div>

            <h1 className="mb-6 text-3xl font-bold tracking-tight">{proposal.title}</h1>

            <div className="mb-8 grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Created: {formatDate(proposal.deadline - 604800)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>
                  Proposer: {proposal.proposer.slice(0, 6)}...{proposal.proposer.slice(-4)}
                </span>
              </div>
            </div>

            <div className="prose max-w-none dark:prose-invert">
              {proposal.description.split("\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col gap-6">
                  {!proposal.finalized && <CountdownTimer deadline={proposal.deadline} />}

                  <div>
                    <h3 className="mb-2 font-semibold">Voting Results</h3>
                    <VotingProgress upvotes={proposal.upvotes} downvotes={proposal.downvotes} />
                  </div>

                  <Separator />

                  {!proposal.finalized && !isExpired && isConnected && !hasVoted ? (
                    <div className="flex flex-col gap-4">
                      <h3 className="font-semibold">Cast Your Vote</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <Button
                          onClick={() => handleVote(true)}
                          disabled={isVoting}
                          className="flex items-center gap-2 bg-success hover:bg-success/90"
                        >
                          <ThumbsUp className="h-4 w-4" />
                          For
                        </Button>
                        <Button
                          onClick={() => handleVote(false)}
                          disabled={isVoting}
                          className="flex items-center gap-2 bg-destructive hover:bg-destructive/90"
                        >
                          <ThumbsDown className="h-4 w-4" />
                          Against
                        </Button>
                      </div>
                      {voteError && <p className="text-sm text-destructive">{voteError}</p>}
                    </div>
                  ) : !proposal.finalized && isExpired && isConnected && isGovernment ? (
                    <div className="flex flex-col gap-4">
                      <h3 className="font-semibold">Finalize Proposal</h3>
                      <Button onClick={handleFinalize} disabled={isFinalizing} className="flex items-center gap-2">
                        {isFinalizing ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Finalizing...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            Finalize Proposal
                          </>
                        )}
                      </Button>
                      {finalizeError && <p className="text-sm text-destructive">{finalizeError}</p>}
                    </div>
                  ) : hasVoted && !proposal.finalized ? (
                    <div className="rounded-md bg-secondary p-4 text-center">
                      <p className="text-sm font-medium">
                        Thank you for voting! Results will be finalized after the voting period ends.
                      </p>
                    </div>
                  ) : null}

                  {!isConnected && (
                    <div className="rounded-md bg-secondary p-4 text-center">
                      <p className="text-sm font-medium">Connect your wallet to vote on this proposal.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : null}
    </div>
  )
}


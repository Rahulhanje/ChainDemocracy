"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CountdownTimer } from "@/components/countdown-timer"
import { VotingProgress } from "@/components/voting-progress"
import { useEffect, useState } from "react"
import { FileText, Tag, ThumbsUp, ThumbsDown, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useWallet } from "@/hooks/WalletContext"
import { getContract } from "@/lib/contract"
import { ethers } from "ethers"

interface ProposalCardProps {
  proposal: {
    id: number
    title: string
    description: string
    category: string
    deadline: number
    upvotes: number
    downvotes: number
    finalized: boolean
  }
}

export async function ProposalCard({ proposal }: ProposalCardProps) {
  const {  account, isConnected, connectWallet, disconnectWallet } = useWallet()
  const[contract, setContract] = useState<ethers.Contract | null>(null);
  const [isVoting, setIsVoting] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)
  const [voteError, setVoteError] = useState<string | null>(null)

  const isExpired = proposal.deadline * 1000 < Date.now()
  const totalVotes = proposal.upvotes + proposal.downvotes
  const result = proposal.upvotes > proposal.downvotes ? "Accepted" : "Rejected"


  async function logContractInstance() {
    const contract = await getContract();
    setContract(contract);
  }

  useEffect(() => {
    logContractInstance();
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
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

  const handleVote = async (voteType: boolean) => {
    if (!isConnected || !contract || isExpired || proposal.finalized) return

    try {
      setIsVoting(true)
      setVoteError(null)

      const tx = await contract.vote(proposal.id, voteType)
      await tx.wait()

      setHasVoted(true)
    } catch (error: any) {
      console.error("Error voting:", error)
      setVoteError(error.message || "Failed to vote. You may have already voted.")
    } finally {
      setIsVoting(false)
    }
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-4 pb-0">
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              <span>
                {getCategoryIcon(proposal.category)} {proposal.category}
              </span>
            </Badge>
            {proposal.finalized ? (
              <Badge variant={result === "Accepted" ? "default" : "destructive"} className="flex items-center gap-1">
                {result === "Accepted" ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                <span>{result}</span>
              </Badge>
            ) : isExpired ? (
              <Badge variant="secondary" className="flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                <span>Pending Finalization</span>
              </Badge>
            ) : (
              <CountdownTimer deadline={proposal.deadline} compact />
            )}
          </div>
          <h3 className="text-lg font-semibold line-clamp-2">{proposal.title}</h3>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{proposal.description}</p>
        <VotingProgress upvotes={proposal.upvotes} downvotes={proposal.downvotes} compact />
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <Link href={`/proposals/${proposal.id}`}>
          <Button variant="outline" size="sm" className="flex items-center gap-1.5">
            <FileText className="h-4 w-4" />
            View Details
          </Button>
        </Link>
        {!proposal.finalized && !isExpired && isConnected && !hasVoted && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleVote(true)}
              disabled={isVoting}
              className="text-success hover:text-success hover:bg-success/10"
            >
              <ThumbsUp className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleVote(false)}
              disabled={isVoting}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <ThumbsDown className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}


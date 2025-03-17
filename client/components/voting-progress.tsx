"use client"

import { cn } from "@/lib/utils"
import { ThumbsUp, ThumbsDown } from "lucide-react"

interface VotingProgressProps {
  upvotes: number
  downvotes: number
  className?: string
  showLabels?: boolean
  compact?: boolean
}

export function VotingProgress({
  upvotes,
  downvotes,
  className,
  showLabels = true,
  compact = false,
}: VotingProgressProps) {
  const total = upvotes + downvotes
  const upPercentage = total > 0 ? (upvotes / total) * 100 : 0
  const downPercentage = total > 0 ? (downvotes / total) * 100 : 0

  if (compact) {
    return (
      <div className={cn("flex flex-col gap-1", className)}>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted flex">
          <div className="h-full bg-success" style={{ width: `${upPercentage}%` }} />
          <div className="h-full bg-destructive" style={{ width: `${downPercentage}%` }} />
        </div>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <ThumbsUp className="h-3 w-3 text-success" />
            <span>{upvotes}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>{downvotes}</span>
            <ThumbsDown className="h-3 w-3 text-destructive" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {showLabels && (
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1.5">
            <ThumbsUp className="h-4 w-4 text-success" />
            <span className="font-medium">For ({upvotes})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-medium">Against ({downvotes})</span>
            <ThumbsDown className="h-4 w-4 text-destructive" />
          </div>
        </div>
      )}
      <div className="flex h-4 w-full overflow-hidden rounded-full">
        <div className="bg-success" style={{ width: `${upPercentage}%` }} />
        <div className="bg-destructive" style={{ width: `${downPercentage}%` }} />
      </div>
    </div>
  )
}
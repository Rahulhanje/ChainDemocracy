"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Clock } from "lucide-react"

interface CountdownTimerProps {
  deadline: number
  className?: string
  compact?: boolean
}

export function CountdownTimer({ deadline, className, compact = false }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Math.floor(Date.now() / 1000)
      const difference = deadline - now

      if (difference <= 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        }
      }

      return {
        days: Math.floor(difference / (60 * 60 * 24)),
        hours: Math.floor((difference % (60 * 60 * 24)) / (60 * 60)),
        minutes: Math.floor((difference % (60 * 60)) / 60),
        seconds: Math.floor(difference % 60),
        isExpired: false,
      }
    }

    setTimeLeft(calculateTimeLeft())

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [deadline])

  if (compact) {
    return (
      <div className={cn("flex items-center gap-1.5 text-sm", className)}>
        <Clock className="h-4 w-4 text-muted-foreground" />
        {timeLeft.isExpired ? (
          <span className="text-destructive font-medium">Expired</span>
        ) : (
          <span className="font-medium">
            {timeLeft.days > 0 && `${timeLeft.days}d `}
            {timeLeft.hours}h {timeLeft.minutes}m
          </span>
        )}
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
        <Clock className="h-4 w-4" />
        {timeLeft.isExpired ? "Voting Ended" : "Time Remaining"}
      </div>
      {timeLeft.isExpired ? (
        <div className="text-destructive font-semibold">Expired</div>
      ) : (
        <div className="flex gap-2">
          <div className="flex flex-col items-center justify-center rounded-md bg-secondary px-2 py-1 min-w-[3rem]">
            <span className="text-xl font-bold">{timeLeft.days}</span>
            <span className="text-xs text-muted-foreground">Days</span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-md bg-secondary px-2 py-1 min-w-[3rem]">
            <span className="text-xl font-bold">{timeLeft.hours}</span>
            <span className="text-xs text-muted-foreground">Hours</span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-md bg-secondary px-2 py-1 min-w-[3rem]">
            <span className="text-xl font-bold">{timeLeft.minutes}</span>
            <span className="text-xs text-muted-foreground">Mins</span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-md bg-secondary px-2 py-1 min-w-[3rem]">
            <span className="text-xl font-bold">{timeLeft.seconds}</span>
            <span className="text-xs text-muted-foreground">Secs</span>
          </div>
        </div>
      )}
    </div>
  )
}


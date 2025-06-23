"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"
import { cn } from "@/components/utils/general.utils"

export interface QuizCategoryItem {
  _id: number | string
  title: string
  description: string
  icon: React.ReactNode
  quizCount?: number
  color: string
  borderColor: string
  route: string
}

interface QuizCategoryCardProps {
  item: QuizCategoryItem
  onStartClick: () => void
  requiredConfirm?: boolean
  color?: string
  borderColor?: string
  icon?: React.ReactNode
}

export const QuizCategoryCard = ({
  item,
  onStartClick,
  requiredConfirm = false,
  color,
  borderColor,
  icon,
}: QuizCategoryCardProps) => {
  const [openConfirm, setOpenConfirm] = useState(false)

  // Check if this is a "Coming soon" item
  const isComingSoon = item.title.toLowerCase().includes("coming soon")

  const handleStart = () => {
    if (isComingSoon) return

    if (requiredConfirm) {
      setOpenConfirm(true)
    } else {
      onStartClick()
    }
  }

  const handleConfirm = () => {
    setOpenConfirm(false)
    onStartClick()
  }

  return (
    <Card
      className={cn(
        "group relative overflow-hidden bg-black/40 backdrop-blur-sm border border-zinc-800/50 transition-all duration-300",
        isComingSoon
          ? "opacity-60 cursor-not-allowed pointer-events-none"
          : cn("cursor-pointer", borderColor ?? item.borderColor),
      )}
    >
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-10 transition-opacity",
          isComingSoon ? "group-hover:opacity-10" : "group-hover:opacity-20",
          color ?? item.color,
        )}
      />

      <div className="relative p-6 flex flex-col h-full">
        <div className="flex items-start gap-4 mb-4">
          <div className={cn("p-3 rounded-xl bg-black/30 border border-white/10", isComingSoon && "opacity-50")}>
            {icon ?? item.icon}
          </div>
          <div>
            <h3 className={cn("text-xl font-semibold text-white mb-2", isComingSoon && "text-gray-400 italic")}>
              {item.title}
            </h3>
            <p className={cn("text-sm", isComingSoon ? "text-gray-500" : "text-gray-400")}>{item.description}</p>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between">
          {!isComingSoon && (
            <>
              {item.quizCount && <span className="text-xs text-gray-500">{item.quizCount} quizzes available</span>}
              <Button
                onClick={handleStart}
                variant="secondary"
                className="bg-black/50 text-white hover:bg-white/10 text-xs"
              >
                Start Quiz <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </>
          )}
          {isComingSoon && (
            <div className="w-full flex justify-center">
              <span className="text-xs text-gray-400 italic">Available soon</span>
            </div>
          )}
        </div>
      </div>

      
    </Card>
  )
}

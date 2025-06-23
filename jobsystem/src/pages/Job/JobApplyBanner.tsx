"use client"

import { Button } from "@/components/ui/button"

interface JobApplyBannerProps {
  title: string
  description: string
  buttonLabel: string
  onClick: () => void
  companyName?: string
  variant?: "apply" | "review"
}

export default function JobApplyBanner({
  title,
  description,
  buttonLabel,
  onClick,
  companyName,
  variant = "apply",
}: JobApplyBannerProps) {
  const bgColor = variant === "apply" ? "bg-blue-600/10 border-blue-500/20" : "bg-purple-600/10 border-purple-500/20"
  const buttonColor = variant === "apply" ? "bg-blue-600 hover:bg-blue-700" : "bg-purple-600 hover:bg-purple-700"

  return (
    <div className={`${bgColor} border rounded-lg p-4`}>
      <div className="flex items-center justify-between">
        <div className="flex-1 mr-4">
          <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
          <p className="text-slate-300 text-sm">
            {description}
            {companyName && ` ${companyName}`}
          </p>
        </div>
        <Button onClick={onClick} size="lg" className={`${buttonColor} flex-shrink-0`}>
          {buttonLabel}
        </Button>
      </div>
    </div>
  )
}

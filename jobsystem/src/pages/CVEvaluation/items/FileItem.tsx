"use client"

import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Calendar, FileText, Building2, MapPin, Eye, Download } from "lucide-react"
import { cn } from "@/components/utils/general.utils"

export type ColorScheme = "blue" | "purple" | "green" | "orange" | "pink" | "yellow"
export type ApplicationStatus = "pending" | "shortlisted" | "rejected" | "accepted"

interface FileItemProps {
  id: string
  title: string
  subtitle?: string
  description?: string
  icon?: React.ReactNode
  subtitleIcon?: React.ReactNode
  descriptionIcon?: React.ReactNode
  selected: boolean
  onSelect: (id: string) => void
  colorScheme?: ColorScheme
  date?: Date
  className?: string
  datePrefix?: string
  maxTitleLength?: number
  maxSubtitleLength?: number
  maxDescriptionLength?: number
  rightContent?: React.ReactNode
  showCheckmark?: boolean
  // New optional props
  onView?: (id: string) => void
  onViewDetail?: (id: string) => void
  onDownload?: (id: string) => void
  status?: ApplicationStatus
}

const colorSchemes = {
  blue: {
    selectedBg: "bg-blue-600/20",
    selectedBorder: "border-blue-500/50",
    selectedRing: "ring-2 ring-blue-500/30",
    iconColor: "text-blue-400",
    checkColor: "text-blue-400",
  },
  purple: {
    selectedBg: "bg-purple-600/20",
    selectedBorder: "border-purple-500/50",
    selectedRing: "ring-2 ring-purple-500/30",
    iconColor: "text-purple-400",
    checkColor: "text-purple-400",
  },
  green: {
    selectedBg: "bg-green-600/20",
    selectedBorder: "border-green-500/50",
    selectedRing: "ring-2 ring-green-500/30",
    iconColor: "text-green-400",
    checkColor: "text-green-400",
  },
  orange: {
    selectedBg: "bg-orange-600/20",
    selectedBorder: "border-orange-500/50",
    selectedRing: "ring-2 ring-orange-500/30",
    iconColor: "text-orange-400",
    checkColor: "text-orange-400",
  },
  pink: {
    selectedBg: "bg-pink-600/20",
    selectedBorder: "border-pink-500/50",
    selectedRing: "ring-2 ring-pink-500/30",
    iconColor: "text-pink-400",
    checkColor: "text-pink-400",
  },
  yellow: {
    selectedBg: "bg-yellow-600/20",
    selectedBorder: "border-yellow-500/50",
    selectedRing: "ring-2 ring-yellow-500/30",
    iconColor: "text-yellow-400",
    checkColor: "text-yellow-400",
  },
}

const statusColors = {
  pending: "bg-yellow-900/20 text-yellow-400 border-yellow-500/30",
  shortlisted: "bg-blue-900/20 text-blue-400 border-blue-500/30",
  rejected: "bg-red-900/20 text-red-400 border-red-500/30",
  accepted: "bg-green-900/20 text-green-400 border-green-500/30",
}

export function FileItem({
  id,
  title,
  subtitle,
  description,
  icon,
  subtitleIcon,
  descriptionIcon,
  selected,
  onSelect,
  colorScheme = "blue",
  date,
  className,
  datePrefix = "Uploaded",
  maxTitleLength = 40,
  maxSubtitleLength = 30,
  maxDescriptionLength = 100,
  rightContent,
  showCheckmark = true,
  onView,
  onViewDetail,
  onDownload,
  status,
}: FileItemProps) {
  const colors = colorSchemes[colorScheme]

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return ""
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  // Default icons based on colorScheme if not provided
  const defaultIcon = (() => {
    switch (colorScheme) {
      case "blue":
        return <FileText className={cn("w-5 h-5 flex-shrink-0", colors.iconColor)} />
      case "purple":
        return <Building2 className={cn("w-5 h-5 flex-shrink-0", colors.iconColor)} />
      case "green":
        return <CheckCircle className={cn("w-5 h-5 flex-shrink-0", colors.iconColor)} />
      default:
        return <FileText className={cn("w-5 h-5 flex-shrink-0", colors.iconColor)} />
    }
  })()

  const defaultSubtitleIcon = <Calendar className="w-3 h-3 flex-shrink-0" />
  const defaultDescriptionIcon = <MapPin className="w-3 h-3 flex-shrink-0" />

  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation()
    action()
  }

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-200 border relative",
        selected
          ? `${colors.selectedBg} ${colors.selectedBorder} ${colors.selectedRing}`
          : "bg-slate-700/30 border-slate-600 hover:bg-slate-700/50 hover:border-slate-500",
        className,
      )}
      onClick={() => onSelect(id)}
    >
      {/* Checkmark in top-right corner */}
      {selected && showCheckmark && (
        <div className="absolute top-2 right-2 z-10">
          <CheckCircle className={cn("w-5 h-5", colors.checkColor)} />
        </div>
      )}

      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {icon || defaultIcon}
          <div className="space-y-1 min-w-0 flex-1 pr-16">
            <h4 className="font-medium text-white text-sm leading-tight truncate" title={title}>
              {truncateText(title, maxTitleLength)}
            </h4>

            {subtitle && (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                {subtitleIcon || defaultSubtitleIcon}
                <span className="truncate" title={subtitle}>
                  {truncateText(subtitle, maxSubtitleLength)}
                </span>
              </div>
            )}

            {date && (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Calendar className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">
                  {datePrefix} {formatDate(date)}
                </span>
              </div>
            )}

            {description && (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                {descriptionIcon || defaultDescriptionIcon}
                <span className="truncate" title={description}>
                  {truncateText(description, maxDescriptionLength)}
                </span>
              </div>
            )}

            {/* Status Badge */}
            {status && (
              <div className="pt-1">
                <Badge variant="outline" className={cn("text-xs", statusColors[status])}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Badge>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-2 right-2 flex items-center gap-1">
            {onView && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-slate-600/50"
                onClick={(e) => handleActionClick(e, () => onView(id))}
                title="View PDF"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}

            {onViewDetail && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-slate-600/50"
                onClick={(e) => handleActionClick(e, () => onViewDetail(id))}
                title="View Details"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}

            {onDownload && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-slate-600/50"
                onClick={(e) => handleActionClick(e, () => onDownload(id))}
                title="Download"
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Custom right content if provided */}
          {rightContent && <div className="absolute top-2 right-2 z-10">{rightContent}</div>}
        </div>
      </CardContent>
    </Card>
  )
}

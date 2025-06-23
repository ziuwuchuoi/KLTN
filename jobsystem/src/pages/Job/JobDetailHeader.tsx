"use client"

import { Button } from "@/components/ui/button"
import { CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, MapPin } from "lucide-react"
import type { JDDetail } from "@/services/file.service"

interface JobDetailHeaderProps {
  job: JDDetail
  onApplyClick: () => void
}

export function JobDetailHeader({ job, onApplyClick }: JobDetailHeaderProps) {
  return (
    <CardHeader className="border-b border-slate-700">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-2xl text-white">{job.title}</CardTitle>
            <div className="flex items-center gap-4 text-slate-400">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                {job.companyName}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {job.location}
              </div>
            </div>
          </div>
          <Button onClick={onApplyClick} className="bg-blue-600 hover:bg-blue-700">
            Apply Now
          </Button>
        </div>
      </div>
    </CardHeader>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  User,
  FileText,
  Building2,
  MapPin,
  Calendar,
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle,
  Award,
} from "lucide-react"
import CustomDialog from "@/components/molecules/CustomDialog"
import { useApplicationQueries } from "@/pages/CVEvaluation/hooks/useFileQueries"
import type { ApplicationItem, ApplicationStatus } from "@/services/file.service"

interface DialogApplicationProps {
  isOpen: boolean
  onClose: () => void
  application: ApplicationItem | null
}

const statusColors = {
  pending: { bg: "bg-yellow-900/20", text: "text-yellow-400", border: "border-yellow-500/30", icon: Clock },
  shortlisted: { bg: "bg-blue-900/20", text: "text-blue-400", border: "border-blue-500/30", icon: CheckCircle },
  rejected: { bg: "bg-red-900/20", text: "text-red-400", border: "border-red-500/30", icon: XCircle },
  accepted: { bg: "bg-green-900/20", text: "text-green-400", border: "border-green-500/30", icon: Award },
}

export function DialogApplication({ isOpen, onClose, application }: DialogApplicationProps) {
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus>("pending")

  const { useApplicationDetail, updateApplicationStatus } = useApplicationQueries()
  const { data: applicationDetail, isLoading } = useApplicationDetail(application?._id || "")

  useEffect(() => {
    if (applicationDetail) {
      setSelectedStatus(applicationDetail.status as ApplicationStatus)
    }
  }, [applicationDetail])

  const handleStatusUpdate = async (newStatus: ApplicationStatus) => {
    if (!application?._id) return

    try {
      await updateApplicationStatus.mutateAsync({
        apId: application._id,
        status: newStatus,
      })
      setSelectedStatus(newStatus)
    } catch (error) {
      console.error("Failed to update application status:", error)
    }
  }

  if (!application) return null

  const currentStatusConfig = statusColors[selectedStatus] || statusColors.pending
  const StatusIcon = currentStatusConfig.icon

  return (
    <CustomDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose()
        }
      }}
      onClose={onClose}
      dialogTitle={
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Application Details</h2>
            <div className="flex items-center gap-2">
              <StatusIcon className={`h-5 w-5 ${currentStatusConfig.text}`} />
              <Badge
                variant="outline"
                className={`${currentStatusConfig.bg} ${currentStatusConfig.text} ${currentStatusConfig.border}`}
              >
                {selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)}
              </Badge>
            </div>
          </div>
          <div className="text-sm text-gray-400">
            Application ID: <span className="font-mono">{application._id}</span>
          </div>
        </div>
      }
      className="bg-slate-900 border-slate-700 w-[85%] h-[90%]"
      childrenContainerClassName="p-0 flex flex-col"
    >
      <div className="flex flex-col h-full">
        {isLoading ? (
          <div className="flex items-center justify-center flex-1">
            <div className="text-gray-400">Loading application details...</div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-6">
                {/* Application Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="h-8 w-8 text-blue-400" />
                        <div>
                          <p className="text-sm text-gray-400">Overall Score</p>
                          <p className="text-2xl font-bold text-white">
                            {applicationDetail?.overallScore ? `${Math.round(applicationDetail.overallScore)}%` : "N/A"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-8 w-8 text-green-400" />
                        <div>
                          <p className="text-sm text-gray-400">Applied Date</p>
                          <p className="text-lg font-semibold text-white">
                            {new Date(applicationDetail?.createdAt || "").toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Clock className="h-8 w-8 text-purple-400" />
                        <div>
                          <p className="text-sm text-gray-400">Last Updated</p>
                          <p className="text-lg font-semibold text-white">
                            {new Date(applicationDetail?.updatedAt || "").toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Job Information */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Job Information</h3>
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-xl font-bold text-white">{applicationDetail?.jd?.title}</h4>
                          <p className="text-gray-300">{applicationDetail?.jd?.position}</p>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <div className="flex items-center gap-1">
                            <Building2 className="h-4 w-4" />
                            <span>{applicationDetail?.jd?.companyName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{applicationDetail?.jd?.location}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-300 leading-relaxed">{applicationDetail?.jd?.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* CV Information */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">CV Information</h3>
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <FileText className="h-6 w-6 text-blue-400" />
                          <div>
                            <h4 className="font-semibold text-white">{applicationDetail?.cv?.fileName}</h4>
                            <p className="text-gray-400">{applicationDetail?.cv?.position}</p>
                          </div>
                        </div>
                        {applicationDetail?.cv?.information?.summary && (
                          <div>
                            <h5 className="font-medium text-gray-300 mb-2">Summary</h5>
                            <p className="text-gray-400 leading-relaxed">{applicationDetail.cv.information.summary}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Evaluation Results */}
                {applicationDetail?.evaluation && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Evaluation Results</h3>
                    <Card className="bg-slate-800/50 border-slate-700">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {applicationDetail.evaluation.reviewCVResponse?.summary && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h5 className="font-medium text-gray-300 mb-2">Overall Score</h5>
                                <p className="text-2xl font-bold text-blue-400">
                                  {Math.round(applicationDetail.evaluation.reviewCVResponse.summary.overall_score)}%
                                </p>
                              </div>
                              <div>
                                <h5 className="font-medium text-gray-300 mb-2">Similarity Score</h5>
                                <p className="text-2xl font-bold text-green-400">
                                  {Math.round(applicationDetail.evaluation.reviewCVResponse.summary.similarity_score)}%
                                </p>
                              </div>
                            </div>
                          )}

                          {applicationDetail.evaluation.reviewCVResponse?.skills_analysis && (
                            <div>
                              <h5 className="font-medium text-gray-300 mb-3">Skills Analysis</h5>
                              <div className="space-y-3">
                                <div>
                                  <p className="text-sm text-gray-400 mb-2">
                                    Match: {applicationDetail.evaluation.reviewCVResponse.skills_analysis.match_percent}
                                    %
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {applicationDetail.evaluation.reviewCVResponse.skills_analysis.matched_skills?.map(
                                      (skill, index) => (
                                        <Badge
                                          key={index}
                                          variant="secondary"
                                          className="bg-green-900/20 text-green-400"
                                        >
                                          {skill}
                                        </Badge>
                                      ),
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Footer with Status Update */}
            <div className="border-t border-slate-700 p-4 bg-slate-800/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-400">Update Application Status:</span>
                </div>
                <div className="flex items-center gap-3">
                  <Select value={selectedStatus} onValueChange={handleStatusUpdate}>
                    <SelectTrigger className="w-40 bg-slate-700 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="shortlisted">Shortlisted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                    </SelectContent>
                  </Select>
                  {updateApplicationStatus.isPending && <div className="text-sm text-gray-400">Updating...</div>}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </CustomDialog>
  )
}

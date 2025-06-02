"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { FileText, Building2, MapPin, Briefcase, Calendar, ChevronDown, ChevronUp, Zap } from "lucide-react"
import { useCVQueries, useJDQueries } from "../hooks/useFileQueries"
import { useState } from "react"
import type { JDDetail } from "@/services/file.service"

interface ReviewStepProps {
  selectedCVId: string
  selectedJDId: string
  jdData: Partial<JDDetail>
  onEvaluate: (jdId?: string) => Promise<void>
  isEvaluating: boolean
  canEvaluate: boolean
}

export function ReviewStep({
  selectedCVId,
  selectedJDId,
  jdData,
  onEvaluate,
  isEvaluating,
  canEvaluate,
}: ReviewStepProps) {
  const [showJDDetails, setShowJDDetails] = useState(false)
  const { useCVDetail } = useCVQueries()
  const { useJDDetail, uploadJD } = useJDQueries()

  const { data: cvDetail } = useCVDetail(selectedCVId)
  const { data: jdDetail } = useJDDetail(selectedJDId)

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleEvaluate = async () => {
    if (!selectedJDId && jdData.title) {
      // Need to upload JD first
      try {
        const newJD = await uploadJD.mutateAsync(jdData)
        await onEvaluate(newJD._id)
      } catch (error) {
        console.error("Failed to upload JD:", error)
      }
    } else {
      await onEvaluate()
    }
  }

  const displayJD = jdDetail || jdData

  return (
    <div className="grid lg:grid-cols-2 gap-8 min-h-[600px]">
      {/* Left Column - CV Details */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <FileText className="w-5 h-5 text-blue-400" />
            Selected CV
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* CV Details */}
          {cvDetail && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-blue-400" />
                <div>
                  <h3 className="font-semibold text-white">CV Document</h3>
                  <p className="text-blue-300">{cvDetail.fileName}</p>
                  <p className="text-xs text-slate-400">Uploaded {formatDate(cvDetail.createdAt)}</p>
                </div>
              </div>

              {/* CV Information Summary */}
              <div className="bg-slate-700/30 rounded-lg p-4 space-y-3">
                <h4 className="font-medium text-white">CV Summary</h4>
                {cvDetail.information.summary && (
                  <p className="text-slate-300 text-sm leading-relaxed">{cvDetail.information.summary}</p>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Skills:</span>
                    <span className="text-white ml-2">{cvDetail.information.skills.length}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Experience:</span>
                    <span className="text-white ml-2">{cvDetail.information.experience.length}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Education:</span>
                    <span className="text-white ml-2">{cvDetail.information.education.length}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Projects:</span>
                    <span className="text-white ml-2">{cvDetail.information.projects.length}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Right Column - Job Description */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-white">
              <Building2 className="w-5 h-5 text-purple-400" />
              Job Description
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowJDDetails(!showJDDetails)}
              className="text-slate-400 hover:text-white"
            >
              {showJDDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Basic JD Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Building2 className="w-6 h-6 text-purple-400" />
              <div>
                <h3 className="font-semibold text-white">{displayJD.title}</h3>
                <p className="text-purple-300">{displayJD.companyName}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-400">
              <MapPin className="w-4 h-4" />
              <span>{displayJD.location}</span>
            </div>

            {selectedJDId && (
              <div className="flex items-center gap-2 text-slate-400">
                <Calendar className="w-4 h-4" />
                <span>Created {formatDate(new Date())}</span>
              </div>
            )}
          </div>

          {/* JD Details (Expandable) */}
          {showJDDetails && (
            <ScrollArea className="h-[400px]">
              <div className="space-y-4 pr-4">
                {/* Description */}
                <div>
                  <h4 className="font-medium text-white mb-2">Description</h4>
                  <p className="text-slate-300 text-sm leading-relaxed">{displayJD.description}</p>
                </div>

                {/* Requirements */}
                {displayJD.requirements && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-white">Requirements</h4>

                    {displayJD.requirements.skills && displayJD.requirements.skills.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium text-slate-400 mb-2">Skills</h5>
                        <div className="flex flex-wrap gap-1">
                          {displayJD.requirements.skills.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {displayJD.requirements.experience && displayJD.requirements.experience.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium text-slate-400 mb-2">Experience</h5>
                        <ul className="text-sm text-slate-300 space-y-1">
                          {displayJD.requirements.experience.map((exp, index) => (
                            <li key={index}>• {exp}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {displayJD.requirements.education && displayJD.requirements.education.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium text-slate-400 mb-2">Education</h5>
                        <ul className="text-sm text-slate-300 space-y-1">
                          {displayJD.requirements.education.map((edu, index) => (
                            <li key={index}>• {edu}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Benefits */}
                {displayJD.benefits && displayJD.benefits.length > 0 && (
                  <div>
                    <h4 className="font-medium text-white mb-2">Benefits</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {displayJD.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-2 text-slate-300 text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          {benefit}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}

          {/* Evaluate Button */}
          <div className="pt-4 border-t border-slate-700">
            <Button
              onClick={handleEvaluate}
              disabled={!canEvaluate || isEvaluating}
              size="lg"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold"
            >
              <Zap className="w-5 h-5 mr-2" />
              {isEvaluating ? "Evaluating..." : "Start CV Evaluation"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

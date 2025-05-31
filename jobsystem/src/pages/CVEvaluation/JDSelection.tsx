"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, MapPin, Calendar, CheckCircle, Plus } from "lucide-react"
import { useJDQueries } from "./hooks/useFileQueries"
import { JDInputForm } from "./JDInput"
import type { JDDetail } from "@/services/file.service"

interface JDSelectionSectionProps {
  selectedJDId: string
  onJDSelect: (jdId: string) => void
  jdData: Partial<JDDetail>
  onJDDataChange: (data: Partial<JDDetail>) => void
  userId: string
}

export function JDSelectionSection({
  selectedJDId,
  onJDSelect,
  jdData,
  onJDDataChange,
  userId,
}: JDSelectionSectionProps) {
  const [activeTab, setActiveTab] = useState("select")

  const { jds, isJDDataLoading, uploadJD } = useJDQueries(userId)

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  // Clear selected JD when switching to manual input
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    if (value === "create") {
      onJDSelect("")
    }
  }

  // Handle JD submission
  const handleJDSubmit = async () => {
    try {
      const newJD = await uploadJD.mutateAsync(jdData)
      // Switch to select tab and select the newly created JD
      setActiveTab("select")
      onJDSelect(newJD._id)
      // Reset the form data
      onJDDataChange({
        title: "",
        description: "",
        companyName: "",
        location: "",
        requirements: {
          experience: [],
          skills: [],
          education: [],
          projects: [],
          languages: [],
          certifications: [],
          summary: "",
        },
        benefits: [],
        visibility: "private",
      })
    } catch (error) {
      console.error("Failed to upload JD:", error)
    }
  }

  return (
    <div className="h-full flex flex-col scroll-y-auto">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2 bg-slate-700 mb-4">
          <TabsTrigger value="select">Select Existing</TabsTrigger>
          <TabsTrigger value="create">Create New</TabsTrigger>
        </TabsList>

        <TabsContent value="select" className="flex-1 mt-0">
          <div className="space-y-4 h-full flex flex-col">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Your Job Descriptions</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab("create")}
                className="border-slate-600 text-slate-300 hover:text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New
              </Button>
            </div>

            <div className="flex-1 min-h-0">
              {isJDDataLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="p-4 bg-slate-700/50 rounded-lg animate-pulse">
                      <div className="h-4 bg-slate-600 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-slate-600 rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-slate-600 rounded w-full"></div>
                    </div>
                  ))}
                </div>
              ) : jds.length === 0 ? (
                <div className="text-center py-8">
                  <Building2 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-white mb-2">No Job Descriptions Found</h4>
                  <p className="text-slate-400 mb-4">Create your first job description to start evaluation.</p>
                  <Button variant="outline" className="border-slate-600" onClick={() => setActiveTab("create")}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Job Description
                  </Button>
                </div>
              ) : (
                <ScrollArea className="h-full">
                  <div className="space-y-3 pr-2">
                    {jds.map((jd) => (
                      <Card
                        key={jd._id}
                        className={`cursor-pointer transition-colors border ${
                          selectedJDId === jd._id
                            ? "bg-purple-600/20 border-purple-500/50"
                            : "bg-slate-700/30 border-slate-600 hover:bg-slate-700/50"
                        }`}
                        onClick={() => onJDSelect(jd._id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <Building2 className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                              <div className="space-y-1 min-w-0 flex-1">
                                <h4 className="font-medium text-white text-sm leading-tight truncate">{jd.title}</h4>
                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                  <MapPin className="w-3 h-3 flex-shrink-0" />
                                  <span className="truncate">{jd.location}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                  <Calendar className="w-3 h-3 flex-shrink-0" />
                                  <span className="truncate">Created {formatDate(new Date())}</span>
                                </div>
                              </div>
                            </div>
                            {selectedJDId === jd._id && (
                              <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0" />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="create" className="flex-1 mt-0">
          <div className="h-full">
            <JDInputForm jdData={jdData} onJDDataChange={onJDDataChange} onSubmit={handleJDSubmit} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

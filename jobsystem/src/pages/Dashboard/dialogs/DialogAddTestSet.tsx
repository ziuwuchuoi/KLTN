"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import CustomDialog from "@/components/molecules/CustomDialog"
import { useQuizQueries } from "@/pages/Quizz/hooks/useQuizQueries"
import { useCodeQueries } from "@/pages/LiveCoding/hooks/useCodeQueries"
import { useAuthStore } from "@/stores/useAuthStore"

import type { CodeProblem } from "@/services/code.service"
import { QuizItem } from "@/services/quiz.service"

interface AddTestsetDialogProps {
  isOpen: boolean
  onClose: () => void
  jdId: string
}

export function AddTestsetDialog({ isOpen, onClose, jdId }: AddTestsetDialogProps) {
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState("quiz")
  const [selectedQuizzes, setSelectedQuizzes] = useState<string[]>([])
  const [selectedCodes, setSelectedCodes] = useState<string[]>([])

  const { technicalQuizzes, isLoadingQuizzes } = useQuizQueries(user?._id)
  const { codeProblems, isCodeProblemsLoading } = useCodeQueries(user?._id)

  const handleQuizSelect = (quizId: string, checked: boolean) => {
    if (checked) {
      setSelectedQuizzes((prev) => [...prev, quizId])
    } else {
      setSelectedQuizzes((prev) => prev.filter((id) => id !== quizId))
    }
  }

  const handleCodeSelect = (codeId: string, checked: boolean) => {
    if (checked) {
      setSelectedCodes((prev) => [...prev, codeId])
    } else {
      setSelectedCodes((prev) => prev.filter((id) => id !== codeId))
    }
  }

  const handleAddToJD = async () => {
    // TODO: Implement API call to link selected quizzes and codes to JD
    console.log("Adding to JD:", { jdId, selectedQuizzes, selectedCodes })

    // Reset selections and close dialog
    setSelectedQuizzes([])
    setSelectedCodes([])
    onClose()
  }

  const totalSelected = selectedQuizzes.length + selectedCodes.length

  return (
    <CustomDialog
      open={isOpen}
      onOpenChange={onClose}
      onClose={onClose}
      dialogTitle="Add Test Sets to Job"
      description="Select quizzes and coding problems to link with this job description"
      className="bg-slate-900 border-slate-700 w-[80%] h-[80%]"
      childrenContainerClassName="p-0 flex flex-col"
    >
      <div className="flex flex-col h-full">
        <div className="border-b border-slate-700 px-6 pt-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 bg-slate-800 border-slate-700">
              <TabsTrigger value="quiz" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white">
                Quiz Problems ({selectedQuizzes.length})
              </TabsTrigger>
              <TabsTrigger value="code" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white">
                Code Problems ({selectedCodes.length})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex-1 flex flex-col">
          <Tabs value={activeTab} className="flex-1 flex flex-col">
            <TabsContent value="quiz" className="flex-1 flex flex-col m-0">
              <ScrollArea className="flex-1 p-6">
                {isLoadingQuizzes ? (
                  <div className="text-center py-8 text-gray-400">Loading quizzes...</div>
                ) : technicalQuizzes.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">No quizzes found</div>
                ) : (
                  <div className="space-y-4">
                    {technicalQuizzes.map((quiz: QuizItem) => (
                      <div
                        key={quiz._id}
                        className="flex items-start space-x-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700"
                      >
                        <Checkbox
                          checked={selectedQuizzes.includes(quiz._id)}
                          onCheckedChange={(checked) => handleQuizSelect(quiz._id, checked as boolean)}
                          className="mt-1"
                        />
                        <div className="flex-1 space-y-2">
                          <h4 className="font-medium text-white">{quiz.title}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span>{quiz.questions?.length || 0} questions</span>
                            <span>{quiz.duration || 0} minutes</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {quiz.categories?.map((category, index) => (
                              <Badge key={index} variant="secondary" className="bg-blue-900/20 text-blue-400 text-xs">
                                {category}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="code" className="flex-1 flex flex-col m-0">
              <ScrollArea className="flex-1 p-6">
                {isCodeProblemsLoading ? (
                  <div className="text-center py-8 text-gray-400">Loading code problems...</div>
                ) : codeProblems.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">No code problems found</div>
                ) : (
                  <div className="space-y-4">
                    {codeProblems.map((code: CodeProblem) => (
                      <div
                        key={code._id}
                        className="flex items-start space-x-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700"
                      >
                        <Checkbox
                          checked={selectedCodes.includes(code._id)}
                          onCheckedChange={(checked) => handleCodeSelect(code._id, checked as boolean)}
                          className="mt-1"
                        />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3">
                            <h4 className="font-medium text-white">{code.title}</h4>
                            <Badge
                              variant="outline"
                              className={
                                code.difficulty === "Easy"
                                  ? "bg-green-900/20 text-green-400 border-green-500/30"
                                  : code.difficulty === "Medium"
                                    ? "bg-yellow-900/20 text-yellow-400 border-yellow-500/30"
                                    : "bg-red-900/20 text-red-400 border-red-500/30"
                              }
                            >
                              {code.difficulty}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-400">Problem ID: {code.problemId}</div>
                          <div className="flex flex-wrap gap-1">
                            {code.topicTags?.map((tag, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="bg-purple-900/20 text-purple-400 text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-700 p-4 bg-slate-800/30">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              {totalSelected > 0 ? `${totalSelected} item(s) selected` : "No items selected"}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} className="border-gray-600 hover:bg-gray-700">
                Cancel
              </Button>
              <Button onClick={handleAddToJD} disabled={totalSelected === 0} className="bg-blue-600 hover:bg-blue-700">
                Add to Job ({totalSelected})
              </Button>
            </div>
          </div>
        </div>
      </div>
    </CustomDialog>
  )
}

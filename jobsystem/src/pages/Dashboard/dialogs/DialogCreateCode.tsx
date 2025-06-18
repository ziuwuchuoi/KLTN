"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X, Trash2 } from "lucide-react"
import CustomDialog from "@/components/molecules/CustomDialog"
import { useCodeQueries } from "@/pages/LiveCoding/hooks/useCodeQueries"
import type { CodeProblemDetail, ProblemTestCase, CodeSnippets } from "@/services/code.service"

interface DialogCreateCodeProps {
  isOpen: boolean
  onClose: () => void
}

const initialCodeData: Partial<CodeProblemDetail> = {
  problemId: 0,
  title: "",
  titleSlug: "",
  difficulty: "Easy",
  content: "",
  topicTags: [],
  hints: [],
  codeSnippets: [],
  testcases: [],
  sourceUrl: "",
}

const initialTestCase: ProblemTestCase = {
  params: [],
  expected: "",
  explanation: "",
}

const initialCodeSnippet: CodeSnippets = {
  language: "",
  code: "",
}

export function DialogCreateCode({ isOpen, onClose }: DialogCreateCodeProps) {
  const [codeData, setCodeData] = useState<Partial<CodeProblemDetail>>(initialCodeData)
  const { createCodeProblem, tags, languages } = useCodeQueries()

  useEffect(() => {
    if (isOpen) {
      setCodeData(initialCodeData)
    }
  }, [isOpen])

  const handleSubmit = async () => {
    try {
      await createCodeProblem.mutateAsync(codeData)
      onClose()
    } catch (error) {
      console.error("Failed to create code problem:", error)
    }
  }

  const addTopicTag = (tag: string) => {
    if (tag && !codeData.topicTags?.includes(tag)) {
      setCodeData((prev) => ({
        ...prev,
        topicTags: [...(prev.topicTags || []), tag],
      }))
    }
  }

  const removeTopicTag = (tag: string) => {
    setCodeData((prev) => ({
      ...prev,
      topicTags: prev.topicTags?.filter((t) => t !== tag) || [],
    }))
  }

  const addHint = () => {
    setCodeData((prev) => ({
      ...prev,
      hints: [...(prev.hints || []), ""],
    }))
  }

  const removeHint = (index: number) => {
    setCodeData((prev) => ({
      ...prev,
      hints: prev.hints?.filter((_, i) => i !== index) || [],
    }))
  }

  const updateHint = (index: number, value: string) => {
    setCodeData((prev) => ({
      ...prev,
      hints: prev.hints?.map((h, i) => (i === index ? value : h)) || [],
    }))
  }

  const addTestCase = () => {
    setCodeData((prev) => ({
      ...prev,
      testcases: [...(prev.testcases || []), { ...initialTestCase }],
    }))
  }

  const removeTestCase = (index: number) => {
    setCodeData((prev) => ({
      ...prev,
      testcases: prev.testcases?.filter((_, i) => i !== index) || [],
    }))
  }

  const updateTestCase = (index: number, field: keyof ProblemTestCase, value) => {
    setCodeData((prev) => ({
      ...prev,
      testcases: prev.testcases?.map((tc, i) => (i === index ? { ...tc, [field]: value } : tc)) || [],
    }))
  }

  const addCodeSnippet = () => {
    setCodeData((prev) => ({
      ...prev,
      codeSnippets: [...(prev.codeSnippets || []), { ...initialCodeSnippet }],
    }))
  }

  const removeCodeSnippet = (index: number) => {
    setCodeData((prev) => ({
      ...prev,
      codeSnippets: prev.codeSnippets?.filter((_, i) => i !== index) || [],
    }))
  }

  const updateCodeSnippet = (index: number, field: keyof CodeSnippets, value: string) => {
    setCodeData((prev) => ({
      ...prev,
      codeSnippets: prev.codeSnippets?.map((cs, i) => (i === index ? { ...cs, [field]: value } : cs)) || [],
    }))
  }

  return (
    <CustomDialog
      open={isOpen}
      onOpenChange={onClose}
      onClose={onClose}
      dialogTitle="Create New Code Problem"
      description="Create a comprehensive coding challenge with test cases and code snippets"
      className="bg-slate-900 border-slate-700 w-[90%] h-[90%]"
      childrenContainerClassName="p-0 flex flex-col"
    >
      <div className="flex flex-col h-full">
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
            {/* Basic Information */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4 space-y-4">
                <h3 className="text-lg font-semibold text-white">Basic Information</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Problem Title *</label>
                    <Input
                      value={codeData.title || ""}
                      onChange={(e) => setCodeData((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g. Two Sum"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Problem ID *</label>
                    <Input
                      type="number"
                      value={codeData.problemId || ""}
                      onChange={(e) =>
                        setCodeData((prev) => ({ ...prev, problemId: Number.parseInt(e.target.value) || 0 }))
                      }
                      placeholder="e.g. 1"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Title Slug</label>
                  <Input
                    value={codeData.titleSlug || ""}
                    onChange={(e) => setCodeData((prev) => ({ ...prev, titleSlug: e.target.value }))}
                    placeholder="e.g. two-sum"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Difficulty *</label>
                  <Select
                    value={codeData.difficulty}
                    onValueChange={(value: "Easy" | "Medium" | "Hard") =>
                      setCodeData((prev) => ({ ...prev, difficulty: value }))
                    }
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Topic Tags</label>
                  <div className="flex gap-2">
                    <Select onValueChange={addTopicTag}>
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue placeholder="Add topic tag" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {tags.map((tag) => (
                          <SelectItem key={tag} value={tag}>
                            {tag}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {codeData.topicTags?.map((tag) => (
                      <div
                        key={tag}
                        className="flex items-center gap-1 bg-purple-900/20 text-purple-400 px-2 py-1 rounded text-xs"
                      >
                        {tag}
                        <button onClick={() => removeTopicTag(tag)}>
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Problem Content *</label>
                  <Textarea
                    value={codeData.content || ""}
                    onChange={(e) => setCodeData((prev) => ({ ...prev, content: e.target.value }))}
                    placeholder="Describe the problem statement in detail..."
                    className="bg-slate-700 border-slate-600 text-white min-h-[120px]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Source URL</label>
                  <Input
                    value={codeData.sourceUrl || ""}
                    onChange={(e) => setCodeData((prev) => ({ ...prev, sourceUrl: e.target.value }))}
                    placeholder="https://leetcode.com/problems/..."
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Hints */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Hints</h3>
                  <Button onClick={addHint} size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Hint
                  </Button>
                </div>

                {codeData.hints?.map((hint, index) => (
                  <div key={index} className="flex gap-2">
                    <Textarea
                      value={hint}
                      onChange={(e) => updateHint(index, e.target.value)}
                      placeholder="Provide a helpful hint"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                    <Button
                      onClick={() => removeHint(index)}
                      size="sm"
                      variant="ghost"
                      className="text-red-400 hover:text-red-300 mt-2"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Test Cases */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Test Cases</h3>
                  <Button onClick={addTestCase} size="sm" className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Test Case
                  </Button>
                </div>

                {codeData.testcases?.map((testcase, index) => (
                  <Card key={index} className="bg-slate-700/50 border-slate-600">
                    <CardContent className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-white">Test Case {index + 1}</h4>
                        <Button
                          onClick={() => removeTestCase(index)}
                          size="sm"
                          variant="ghost"
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Expected Output</label>
                        <Textarea
                          value={testcase.expected}
                          onChange={(e) => updateTestCase(index, "expected", e.target.value)}
                          placeholder="Expected output"
                          className="bg-slate-600 border-slate-500 text-white font-mono text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Explanation</label>
                        <Textarea
                          value={testcase.explanation}
                          onChange={(e) => updateTestCase(index, "explanation", e.target.value)}
                          placeholder="Explain the test case"
                          className="bg-slate-600 border-slate-500 text-white"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            {/* Code Snippets */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Code Snippets</h3>
                  <Button onClick={addCodeSnippet} size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Code Snippet
                  </Button>
                </div>

                {codeData.codeSnippets?.map((snippet, index) => (
                  <Card key={index} className="bg-slate-700/50 border-slate-600">
                    <CardContent className="p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-white">Code Snippet {index + 1}</h4>
                        <Button
                          onClick={() => removeCodeSnippet(index)}
                          size="sm"
                          variant="ghost"
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Language</label>
                        <Select
                          value={snippet.language}
                          onValueChange={(value) => updateCodeSnippet(index, "language", value)}
                        >
                          <SelectTrigger className="bg-slate-600 border-slate-500">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700">
                            {languages.map((lang) => (
                              <SelectItem key={lang.id} value={lang.name}>
                                {lang.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Code Template</label>
                        <Textarea
                          value={snippet.code}
                          onChange={(e) => updateCodeSnippet(index, "code", e.target.value)}
                          placeholder="def solution():
    # Your code here
    pass"
                          className="bg-slate-600 border-slate-500 text-white font-mono text-sm min-h-[100px]"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="border-t border-slate-700 p-4 bg-slate-800/30">
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose} className="border-gray-600 hover:bg-gray-700">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createCodeProblem.isPending || !codeData.title || !codeData.problemId || !codeData.content}
              className="bg-green-600 hover:bg-green-700"
            >
              {createCodeProblem.isPending ? "Creating..." : "Create Code Problem"}
            </Button>
          </div>
        </div>
      </div>
    </CustomDialog>
  )
}

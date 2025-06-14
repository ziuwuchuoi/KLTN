"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { FileItem } from "@/pages/CVEvaluation/items/FileItem"
import { useCVQueries } from "@/pages/CVEvaluation/hooks/useFileQueries"
import { useAuthStore } from "@/stores/useAuthStore"

export function CVContent() {
  const { user } = useAuthStore()
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const { cvs, isCVDataLoading } = useCVQueries(user?._id)

  const handleSelect = (id: string) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const handleView = (id: string) => {
    const cv = cvs.find((cv) => cv._id === id)
    if (cv?.fileUrl) {
      window.open(cv.fileUrl, "_blank")
    }
  }

  const handleDownload = (id: string) => {
    const cv = cvs.find((cv) => cv._id === id)
    if (cv?.fileUrl) {
      const link = document.createElement("a")
      link.href = cv.fileUrl
      link.download = cv.fileName || "cv.pdf"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  if (isCVDataLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">My CVs</h2>
            <p className="text-gray-400">Manage your curriculum vitae documents</p>
          </div>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-400">Loading CVs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">My CVs</h2>
          <p className="text-gray-400">Manage your curriculum vitae documents</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Upload CV
        </Button>
      </div>

      {cvs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">No CVs uploaded yet</p>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Upload Your First CV
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {cvs.map((cv) => (
            <FileItem
              key={cv._id}
              id={cv._id}
              title={cv.fileName || cv.position}
              subtitle={cv.position}
              selected={selectedItems.includes(cv._id)}
              onSelect={handleSelect}
              colorScheme="blue"
              date={new Date(cv.createdAt)}
              datePrefix="Uploaded"
              onView={handleView}
              onDownload={handleDownload}
            />
          ))}
        </div>
      )}
    </div>
  )
}

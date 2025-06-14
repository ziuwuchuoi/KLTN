"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FileItem } from "@/pages/CVEvaluation/items/FileItem"
import { useApplicationQueries } from "@/pages/CVEvaluation/hooks/useFileQueries"
import { useAuthStore } from "@/stores/useAuthStore"
import type { ApplicationItem, ApplicationStatus } from "@/services/file.service"

export function ApplicationContent() {
  const { user } = useAuthStore()
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [selectedApplication, setSelectedApplication] = useState<ApplicationItem | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { applications, isApplicationDataLoading } = useApplicationQueries(user?._id)

  const handleSelect = (id: string) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const handleViewDetail = (id: string) => {
    const application = applications.find((app) => app._id === id)
    if (application) {
      setSelectedApplication(application)
      setIsDialogOpen(true)
    }
  }

  if (isApplicationDataLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Applications</h2>
            <p className="text-gray-400">Track your job applications and their status</p>
          </div>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-400">Loading Applications...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Applications</h2>
            <p className="text-gray-400">Track your job applications and their status</p>
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No applications submitted yet</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {applications.map((application) => (
              <FileItem
                key={application._id}
                id={application._id}
                title={`Application #${application._id.slice(-6)}`}
                subtitle="Job Application"
                selected={selectedItems.includes(application._id)}
                onSelect={handleSelect}
                colorScheme="yellow"
                date={new Date(application.createdAt)}
                datePrefix="Applied"
                onViewDetail={handleViewDetail}
                status={application.status as ApplicationStatus}
              />
            ))}
          </div>
        )}
      </div>

      {/* Application Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">Application Details</DialogTitle>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-4 text-white">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-300 mb-2">Application ID</h3>
                  <p className="font-mono text-sm">{selectedApplication._id}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-300 mb-2">Status</h3>
                  <p className="capitalize">{selectedApplication.status}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-300 mb-2">Applied Date</h3>
                  <p>{new Date(selectedApplication.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-300 mb-2">Last Updated</h3>
                  <p>{new Date(selectedApplication.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-300 mb-2">CV ID</h3>
                <p className="font-mono text-sm">{selectedApplication.cvId}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-300 mb-2">Job Description ID</h3>
                <p className="font-mono text-sm">{selectedApplication.jdId}</p>
              </div>

              {selectedApplication.evaluationId && (
                <div>
                  <h3 className="font-semibold text-gray-300 mb-2">Evaluation ID</h3>
                  <p className="font-mono text-sm">{selectedApplication.evaluationId}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

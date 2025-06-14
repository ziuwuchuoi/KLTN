import { cn } from "@/components/utils/general.utils"
import { User, FileText, Briefcase, Send } from "lucide-react"
import type { TabType } from "./PageProfile"

interface ProfileSidebarProps {
  activeTab: TabType
  setActiveTab: (tab: TabType) => void
}

const menuItems = [
  { id: "profile" as TabType, label: "Profile", icon: User },
  { id: "cvs" as TabType, label: "CVs", icon: FileText },
  { id: "jds" as TabType, label: "Job Descriptions", icon: Briefcase },
  { id: "applications" as TabType, label: "Applications", icon: Send },
]

export function ProfileSidebar({ activeTab, setActiveTab }: ProfileSidebarProps) {
  return (
    <nav className="space-y-2">
      {menuItems.map((item) => {
        const Icon = item.icon
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors",
              activeTab === item.id ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800/50",
            )}
          >
            <Icon className="h-5 w-5" />
            <span>{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}

import type React from "react"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Loader2 } from "lucide-react"

interface ProfileHeaderProps {
  user: {
    name: string
    email: string
    avatar?: string
  }
  updateAvatar: (avatar: string) => void
}

export function ProfileHeader({ user, updateAvatar }: ProfileHeaderProps) {
  const [isUploading, setIsUploading] = useState(false)

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        setTimeout(() => {
          updateAvatar(event.target.result as string)
          setIsUploading(false)
        }, 1000)
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-8">
      <div className="relative group">
        <Avatar className="h-32 w-32 border-4 border-gray-800">
          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
          <AvatarFallback className="text-3xl bg-gray-800">
            {user.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>

        <label
          htmlFor="avatar-upload"
          className="absolute bottom-0 right-0 p-2 rounded-full bg-gray-800 hover:bg-gray-700 cursor-pointer transition-colors"
        >
          {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Camera className="h-5 w-5" />}
          <span className="sr-only">Upload avatar</span>
        </label>
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarChange}
          disabled={isUploading}
        />
      </div>

      <div className="text-center sm:text-left">
        <h1 className="text-3xl font-bold">{user.name}</h1>
        <p className="text-gray-400">{user.email}</p>
      </div>
    </div>
  )
}

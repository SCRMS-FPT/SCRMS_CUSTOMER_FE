"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Badge } from "../ui/badge"
import { Clock, Camera, Upload } from "lucide-react"

// Hàm tiện ích để định dạng ngày tháng
function formatDate(dateString) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date)
}

export function CoachAvatar({ avatar, firstName, lastName, updatedAt, isEditing, onInputChange, onAvatarChange }) {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`
  const [previewUrl, setPreviewUrl] = useState(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Kiểm tra xem file có phải là ảnh không
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file ảnh")
      return
    }

    // Tạo URL cho file đã chọn
    const fileUrl = URL.createObjectURL(file)
    setPreviewUrl(fileUrl)

    // Gọi hàm callback để cập nhật avatar trong state cha
    onAvatarChange(fileUrl, file)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <Avatar className="h-36 w-36 border-2 border-primary shadow-lg">
          <AvatarImage src={isEditing && previewUrl ? previewUrl : avatar} alt={`${firstName} ${lastName}`} />
          <AvatarFallback className="text-3xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
            {initials}
          </AvatarFallback>
        </Avatar>

        {/* Badge hiển thị vai trò */}
        <Badge className="absolute -bottom-2 -right-2 px-3 py-1.5 bg-indigo-600 text-white shadow-md">Coach</Badge>

        {/* Nút chỉnh sửa avatar khi đang ở chế độ edit */}
        {isEditing && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
            <label htmlFor="avatar-upload" className="cursor-pointer p-2 bg-white/80 rounded-full hover:bg-white">
              <Camera className="h-6 w-6 text-indigo-600" />
              <input id="avatar-upload" type="file" accept="image/*" onChange={handleFileChange} className="sr-only" />
            </label>
          </div>
        )}
      </div>

      {isEditing && (
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="avatar-upload-btn"
            className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 cursor-pointer"
          >
            <Upload className="h-4 w-4" />
            Tải ảnh từ máy tính
            <input
              id="avatar-upload-btn"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="sr-only"
            />
          </label>
        </div>
      )}

      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">
          {firstName} {lastName}
        </h2>

        {/* Thời gian cập nhật */}
        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mt-2">
          <Clock className="h-3 w-3" />
          <span>Cập nhật: {formatDate(updatedAt)}</span>
        </div>
      </div>
    </div>
  )
}


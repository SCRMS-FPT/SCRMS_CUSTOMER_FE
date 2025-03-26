"use client"

import { Button } from "../ui/button"
import { Calendar, Edit, MessageSquare, Heart, Share2, AlertCircle, Package } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { useNavigate } from "react-router-dom"

export function CoachActions({ isEditing, onEdit, onSave, coachId }) {
  const navigate = useNavigate()

  const handleScheduleClick = () => {
    // Điều hướng đến trang lịch làm việc của coach
    if (coachId) {
      navigate(`/coach-schedules/${coachId}`)
    }
  }

  const handlePackagesClick = () => {
    if (coachId) {
      navigate(`/coach-packages/${coachId}`); // Điều hướng đến đường dẫn với coach_id
    }
  }

  return (
    <div className="space-y-4 w-full">
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <Button className="flex-1 gap-2 shadow-sm bg-indigo-600 hover:bg-indigo-700 text-white" disabled={isEditing}>
          <MessageSquare className="h-4 w-4" />
          Nhắn tin
        </Button>
        <Button
          className="flex-1 gap-2 shadow-sm border-indigo-300 text-indigo-700 hover:bg-indigo-50"
          variant="outline"
          disabled={isEditing}
          onClick={handleScheduleClick}
        >
          <Calendar className="h-4 w-4" />
          Lịch Làm Việc
        </Button>
        <Button
          className="flex-1 gap-2 shadow-sm border-indigo-300 text-indigo-700 hover:bg-indigo-50"
          variant="outline"
          disabled={isEditing}
          onClick={handlePackagesClick}
        >
          <Package className="h-4 w-4" />
          Gói Đào Tạo
        </Button>
      </div>

      {!isEditing && (
        <div className="flex justify-between gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-9 w-9 hover:bg-pink-50 hover:text-pink-600"
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Lưu vào danh sách yêu thích</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 hover:bg-blue-50 hover:text-blue-600">
                <Share2 className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Share2 className="h-4 w-4 mr-2" />
                Chia sẻ hồ sơ
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 hover:bg-red-50 hover:text-red-600">
                  <AlertCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Báo cáo hồ sơ</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full h-9 w-9 ml-auto bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                  onClick={onEdit}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Chỉnh sửa hồ sơ</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  )
}


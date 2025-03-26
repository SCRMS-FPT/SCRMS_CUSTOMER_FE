"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { CoachAvatar } from "../components/profile/coach-avatar"
import { CoachInfo } from "../components/profile/coach-info"
import { CoachBio } from "../components/profile/coach-bio"
import { CoachActions } from "../components/profile/coach-actions"
import { userData } from "../data/userData"
import { coachData } from "../data/coachData"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Separator } from "../components/ui/separator"
import { ChevronLeft, Award, Star, Trophy } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"

export default function CoachProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedCoach, setSelectedCoach] = useState(null)
  const [editedUser, setEditedUser] = useState(null)
  const [editedCoach, setEditedCoach] = useState(null)
  const [avatarFile, setAvatarFile] = useState(null)

  useEffect(() => {
    // Giả lập tải dữ liệu
    const timer = setTimeout(() => {
      if (id) {
        // Tìm user theo ID
        const foundUser = userData.find((user) => user.id === id)
        const foundCoach = coachData.find((coach) => coach.id === id)

        if (foundUser && foundCoach) {
          setSelectedUser(foundUser)
          setSelectedCoach(foundCoach)
          setEditedUser(foundUser)
          setEditedCoach(foundCoach)
        } else {
          // Nếu không tìm thấy, sử dụng user đầu tiên
          setSelectedUser(userData[0])
          setSelectedCoach(coachData[0])
          setEditedUser(userData[0])
          setEditedCoach(coachData[0])
        }
      } else {
        // Mặc định chọn user và coach đầu tiên nếu không có id
        setSelectedUser(userData[0])
        setSelectedCoach(coachData[0])
        setEditedUser(userData[0])
        setEditedCoach(coachData[0])
      }
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [id])

  const handleEditToggle = () => {
    if (isEditing) {
      // Nếu đang ở chế độ chỉnh sửa và nhấn Cancel, reset lại dữ liệu
      setEditedUser(selectedUser)
      setEditedCoach(selectedCoach)
      setAvatarFile(null)

      // Giải phóng các URL đối tượng nếu có
      if (editedCoach.avatar && editedCoach.avatar.startsWith("blob:")) {
        URL.revokeObjectURL(editedCoach.avatar)
      }
    }
    setIsEditing(!isEditing)
  }

  const handleSaveChanges = () => {
    // Cập nhật thời gian chỉnh sửa
    const updatedCoach = {
      ...editedCoach,
      updated_at: new Date().toISOString(),
    }

    // Trong thực tế, đây là nơi bạn sẽ gọi API để lưu thay đổi và tải lên file ảnh
    // Ví dụ: uploadAvatarToServer(avatarFile).then(url => { ... })

    setSelectedUser(editedUser)
    setSelectedCoach(updatedCoach)
    setEditedCoach(updatedCoach)
    setIsEditing(false)
    alert("Thông tin đã được cập nhật!")
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target

    // Xác định xem trường này thuộc về user hay coach
    if (name === "rate_per_hour" || name === "avatar" || name === "bio") {
      setEditedCoach({
        ...editedCoach,
        [name]: name === "rate_per_hour" ? Number.parseFloat(value) : value,
      })
    } else {
      setEditedUser({
        ...editedUser,
        [name]: value,
      })
    }
  }

  const handleAvatarChange = (fileUrl, file) => {
    setEditedCoach({
      ...editedCoach,
      avatar: fileUrl,
    })
    setAvatarFile(file)
  }

  if (isLoading || !selectedUser || !selectedCoach) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50">
      <div className="container mx-auto py-8 px-4 max-w-full">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" className="gap-1" onClick={() => navigate(-1)}>
            <ChevronLeft className="h-4 w-4" />
            Quay lại
          </Button>
          <h1 className="text-2xl font-bold ml-4 text-indigo-800">Hồ Sơ Coach</h1>

          <div className="ml-auto">
            <Button
              variant={isEditing ? "outline" : "secondary"}
              onClick={handleEditToggle}
              className="mr-2 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {isEditing ? "Hủy" : "Chỉnh sửa"}
            </Button>

            {isEditing && (
              <Button onClick={handleSaveChanges} className="bg-green-600 hover:bg-green-700 text-white">
                Lưu thay đổi
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            <Card className="rounded-xl p-6 shadow-md border-0 bg-white overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
              <div className="relative pt-8">
                <CoachAvatar
                  avatar={isEditing ? editedCoach.avatar : selectedCoach.avatar}
                  firstName={isEditing ? editedUser.firstName : selectedUser.firstName}
                  lastName={isEditing ? editedUser.lastName : selectedUser.lastName}
                  updatedAt={selectedCoach.updated_at}
                  isEditing={isEditing}
                  onInputChange={handleInputChange}
                  onAvatarChange={handleAvatarChange}
                />

                <Separator className="my-6" />

                <CoachActions
                  isEditing={isEditing}
                  onEdit={handleEditToggle}
                  onSave={handleSaveChanges}
                  coachId={selectedCoach.id}
                />
              </div>
            </Card>

            {/* Thành tích và chứng chỉ */}
            <Card className="rounded-xl p-6 shadow-md border-0 bg-white">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="h-5 w-5 text-amber-500" />
                <h3 className="font-semibold text-gray-800">Thành tích & Chứng chỉ</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-md bg-amber-50">
                  <Award className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Chứng chỉ huấn luyện viên cấp C</p>
                    <p className="text-xs text-muted-foreground">Liên đoàn bóng đá Việt Nam</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-md bg-blue-50">
                  <Star className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Huấn luyện viên xuất sắc 2024</p>
                    <p className="text-xs text-muted-foreground">Giải trẻ U15 Quốc gia</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="md:col-span-2 space-y-6">
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4 bg-white shadow-sm">
                <TabsTrigger
                  value="info"
                  className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700"
                >
                  Thông tin
                </TabsTrigger>
                <TabsTrigger
                  value="bio"
                  className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700"
                >
                  Giới thiệu
                </TabsTrigger>
              </TabsList>
              <TabsContent value="info" className="mt-0">
                <CoachInfo
                  isEditing={isEditing}
                  userData={isEditing ? editedUser : selectedUser}
                  coachData={isEditing ? editedCoach : selectedCoach}
                  onInputChange={handleInputChange}
                />
              </TabsContent>
              <TabsContent value="bio" className="mt-0">
                <CoachBio
                  isEditing={isEditing}
                  bio={isEditing ? editedCoach.bio : selectedCoach.bio}
                  selfIntroduction={isEditing ? editedUser.selfIntroduction : selectedUser.selfIntroduction}
                  onInputChange={handleInputChange}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}


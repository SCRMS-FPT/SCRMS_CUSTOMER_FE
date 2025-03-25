"use client"

import { Card, CardContent } from "../ui/card"
import { AtSign, Phone, Calendar, User, DollarSign, Clock, Award } from "lucide-react"
import { Input } from "../ui/input"
import { Label } from "../ui/label"

// Hàm tiện ích để định dạng ngày tháng
function formatDate(dateString) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date)
}

// Hàm tiện ích để định dạng tiền tệ
function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(amount)
}

export function CoachInfo({ isEditing, userData, coachData, onInputChange }) {
  const { firstName, lastName, email, phone, birthDate, gender, createdAt } = userData
  const { rate_per_hour } = coachData

  return (
    <Card className="w-full shadow-md border-0 bg-white">
      <CardContent className="p-6">
        <div className="grid gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
              <User className="mr-2 h-6 w-6 text-indigo-600" />
              Thông tin cá nhân
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 p-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-indigo-600" />
                  <p className="text-sm font-medium text-gray-600">Họ</p>
                </div>
                {isEditing ? (
                  <Input
                    name="lastName"
                    value={lastName}
                    onChange={onInputChange}
                    className="mt-1 border-indigo-200 focus:border-indigo-400"
                  />
                ) : (
                  <p className="font-medium pl-6 text-gray-800">{lastName}</p>
                )}
              </div>

              <div className="space-y-1.5 p-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-indigo-600" />
                  <p className="text-sm font-medium text-gray-600">Tên</p>
                </div>
                {isEditing ? (
                  <Input
                    name="firstName"
                    value={firstName}
                    onChange={onInputChange}
                    className="mt-1 border-indigo-200 focus:border-indigo-400"
                  />
                ) : (
                  <p className="font-medium pl-6 text-gray-800">{firstName}</p>
                )}
              </div>

              <div className="space-y-1.5 p-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors">
                <div className="flex items-center gap-2">
                  <AtSign className="h-4 w-4 text-indigo-600" />
                  <p className="text-sm font-medium text-gray-600">Email</p>
                </div>
                {isEditing ? (
                  <Input
                    name="email"
                    value={email}
                    onChange={onInputChange}
                    className="mt-1 border-indigo-200 focus:border-indigo-400"
                    type="email"
                  />
                ) : (
                  <p className="font-medium pl-6 text-gray-800">{email}</p>
                )}
              </div>

              <div className="space-y-1.5 p-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-indigo-600" />
                  <p className="text-sm font-medium text-gray-600">Số điện thoại</p>
                </div>
                {isEditing ? (
                  <Input
                    name="phone"
                    value={phone}
                    onChange={onInputChange}
                    className="mt-1 border-indigo-200 focus:border-indigo-400"
                  />
                ) : (
                  <p className="font-medium pl-6 text-gray-800">{phone}</p>
                )}
              </div>

              <div className="space-y-1.5 p-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-indigo-600" />
                  <p className="text-sm font-medium text-gray-600">Ngày sinh</p>
                </div>
                {isEditing ? (
                  <Input
                    name="birthDate"
                    value={new Date(birthDate).toISOString().split("T")[0]}
                    onChange={onInputChange}
                    className="mt-1 border-indigo-200 focus:border-indigo-400"
                    type="date"
                  />
                ) : (
                  <p className="font-medium pl-6 text-gray-800">{formatDate(birthDate)}</p>
                )}
              </div>

              <div className="space-y-1.5 p-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-indigo-600" />
                  <p className="text-sm font-medium text-gray-600">Giới tính</p>
                </div>
                {isEditing ? (
                  <div className="pl-6 mt-1">
                    <Label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="gender"
                        value="Male"
                        checked={gender === "Male"}
                        onChange={onInputChange}
                        className="text-indigo-600"
                      />
                      <span>Nam</span>
                    </Label>
                    <Label className="flex items-center space-x-2 mt-1">
                      <input
                        type="radio"
                        name="gender"
                        value="Female"
                        checked={gender === "Female"}
                        onChange={onInputChange}
                        className="text-indigo-600"
                      />
                      <span>Nữ</span>
                    </Label>
                  </div>
                ) : (
                  <p className="font-medium pl-6 text-gray-800">{gender === "Male" ? "Nam" : "Nữ"}</p>
                )}
              </div>

              <div className="space-y-1.5 p-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-indigo-600" />
                  <p className="text-sm font-medium text-gray-600">Giá theo giờ</p>
                </div>
                {isEditing ? (
                  <Input
                    name="rate_per_hour"
                    value={rate_per_hour}
                    onChange={onInputChange}
                    className="mt-1 border-indigo-200 focus:border-indigo-400"
                    type="number"
                    step="0.01"
                  />
                ) : (
                  <p className="font-semibold pl-6 text-indigo-600">{formatCurrency(rate_per_hour)}</p>
                )}
              </div>

              <div className="space-y-1.5 p-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-indigo-600" />
                  <p className="text-sm font-medium text-gray-600">Ngày tham gia</p>
                </div>
                <p className="font-medium pl-6 text-gray-800">{formatDate(createdAt)}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
              <Award className="mr-2 h-6 w-6 text-indigo-600" />
              Kinh nghiệm
            </h2>
            <div className="p-4 bg-indigo-50 rounded-lg">
              <p className="text-gray-700">
                Huấn luyện viên với nhiều năm kinh nghiệm trong lĩnh vực đào tạo bóng đá trẻ. Chuyên môn sâu về kỹ thuật
                cá nhân và chiến thuật đội bóng.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


"use client"
import { motion, AnimatePresence } from "framer-motion"
import BookingStatusBadge from "./booking-status-badge"
import { userData } from "../../data/userData"
import { useState, useEffect } from "react"

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount)
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

const formatDateTime = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

const BookingDetailModal = ({ isOpen, onClose, booking, onConfirm, onReject, statusUpdated, bookingStatuses }) => {
  // Find booking status - Sử dụng useEffect để cập nhật trạng thái khi bookingStatuses thay đổi
  const [currentStatus, setCurrentStatus] = useState(null)

  useEffect(() => {
    if (booking && bookingStatuses) {
      const status = bookingStatuses.find((status) => status.id === booking.id) || {
        status: "pending",
        updated_at: booking.booking_date,
        message: "Đang chờ xác nhận từ huấn luyện viên.",
      }
      setCurrentStatus(status)
    }
  }, [booking, bookingStatuses, statusUpdated])

  if (!booking) return null

  // Find user data
  const user = userData.find((u) => u.id === booking.user_id) || {}
  const userName = user ? `${user.firstName} ${user.lastName}` : "Không xác định"

  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  }

  const contentVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  }

  if (!currentStatus) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={modalVariants}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            variants={contentVariants}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-emerald-600 text-white px-6 py-4 rounded-t-xl flex justify-between items-center">
              <h2 className="text-xl font-bold">Chi tiết đặt lịch</h2>
              <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-1">
                    Mã booking: <span className="text-emerald-600">{booking.id.split("-").pop()}</span>
                  </h3>
                  <p className="text-slate-600 text-sm">Cập nhật: {formatDateTime(currentStatus.updated_at)}</p>
                </div>
                <BookingStatusBadge status={currentStatus.status} />
              </div>

              {/* Thông tin khách hàng */}
              <div className="bg-slate-50 rounded-lg p-4 mb-6">
                <h4 className="text-md font-semibold text-slate-800 mb-3 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-emerald-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Thông tin khách hàng
                </h4>
                <div className="flex items-center">
                  <img
                    src={user.avatar || "/placeholder.svg?height=100&width=100"}
                    alt={userName}
                    className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-emerald-100"
                  />
                  <div>
                    <p className="font-medium text-slate-800">{userName}</p>
                    <p className="text-slate-600 text-sm">{user.email}</p>
                    <p className="text-slate-600 text-sm">{user.phone}</p>
                  </div>
                </div>
              </div>

              {/* Thông tin buổi tập */}
              <div className="bg-slate-50 rounded-lg p-4 mb-6">
                <h4 className="text-md font-semibold text-slate-800 mb-3 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-emerald-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  Thông tin buổi tập
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-emerald-600 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-slate-700">Ngày: {formatDate(booking.booking_date)}</span>
                  </div>

                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-emerald-600 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-slate-700">Thời gian: {booking.time_slot}</span>
                  </div>

                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-emerald-600 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="text-slate-700">Địa điểm: Sân vận động ABC</span>
                  </div>
                </div>
              </div>

              {/* Thông tin thanh toán */}
              <div className="bg-slate-50 rounded-lg p-4 mb-6">
                <h4 className="text-md font-semibold text-slate-800 mb-3 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-emerald-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Thông tin thanh toán
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Giá buổi tập:</span>
                    <span className="text-slate-800 font-medium">{formatCurrency(booking.total_price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Phương thức thanh toán:</span>
                    <span className="text-slate-800 font-medium">Thanh toán khi đến tập</span>
                  </div>
                  <div className="border-t border-slate-200 my-2 pt-2 flex justify-between">
                    <span className="text-slate-800 font-semibold">Tổng cộng:</span>
                    <span className="text-emerald-600 font-bold">{formatCurrency(booking.total_price)}</span>
                  </div>
                </div>
              </div>

              {/* Thông tin trạng thái */}
              <div className="bg-slate-50 rounded-lg p-4 mb-6">
                <h4 className="text-md font-semibold text-slate-800 mb-2 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-emerald-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Trạng thái
                </h4>
                <div className="flex items-center mb-2">
                  <BookingStatusBadge status={currentStatus.status} />
                  <span className="ml-2 text-slate-700">{currentStatus.message}</span>
                </div>

                {statusUpdated && (
                  <div className="mt-2 p-2 bg-emerald-50 border border-emerald-200 rounded-md text-emerald-700 text-sm">
                    Trạng thái đã được cập nhật thành công!
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-4 mt-6">
                {currentStatus.status === "pending" && !statusUpdated && (
                  <>
                    <button
                      onClick={() => onReject(booking.id)}
                      className="px-6 py-2.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-rose-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Từ chối
                    </button>
                    <button
                      onClick={() => onConfirm(booking.id)}
                      className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center shadow-sm"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Xác nhận
                    </button>
                  </>
                )}
                {(currentStatus.status !== "pending" || statusUpdated) && (
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center shadow-sm"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Đóng
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default BookingDetailModal


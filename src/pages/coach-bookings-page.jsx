"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import BookingCard from "../components/bookinfo/booking-card"
import BookingDetailModal from "../components/bookinfo/booking-detail-modal"
import BookingFilter from "../components/bookinfo/booking-filter"
import BookingPagination from "../components/bookinfo/booking-pagination"
import BookingSkeleton from "../components/bookinfo/booking-skeleton"
import ConfirmActionModal from "../components/bookinfo/confirm-action-modal"
import { coachBookingData } from "../data/coachBookingData"
import { coachBookingStatusData } from "../data/coachBookingStatusData"
import { userData } from "../data/userData"

const CoachBookingsPage = () => {
  // State for bookings data
  const [bookings, setBookings] = useState(coachBookingData)
  const [bookingStatuses, setBookingStatuses] = useState(coachBookingStatusData)
  const [filteredBookings, setFilteredBookings] = useState([])
  const [loading, setLoading] = useState(true)

  // State for filters
  const [statusFilter, setStatusFilter] = useState("")
  const [dateFilter, setDateFilter] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(4)
  const [paginatedBookings, setPaginatedBookings] = useState([])

  // State for modals
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
  const [bookingIdToAction, setBookingIdToAction] = useState(null)

  // Thêm state để theo dõi trạng thái đã cập nhật
  const [statusUpdated, setStatusUpdated] = useState(false)

  // Simulate loading
  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Apply filters
  useEffect(() => {
    let result = [...bookings]

    // Apply status filter
    if (statusFilter) {
      // Filter by status from bookingStatuses
      const bookingIdsWithStatus = bookingStatuses
        .filter((status) => status.status === statusFilter)
        .map((status) => status.id)

      result = result.filter((booking) => bookingIdsWithStatus.includes(booking.id))
    }

    // Apply date filter
    if (dateFilter) {
      const filterDate = new Date(dateFilter)
      result = result.filter((booking) => {
        const bookingDate = new Date(booking.booking_date)
        return (
          bookingDate.getFullYear() === filterDate.getFullYear() &&
          bookingDate.getMonth() === filterDate.getMonth() &&
          bookingDate.getDate() === filterDate.getDate()
        )
      })
    }

    // Apply search filter
    if (searchTerm) {
      result = result.filter((booking) => {
        const user = userData.find((u) => u.id === booking.user_id)
        if (!user) return false

        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase()
        return fullName.includes(searchTerm.toLowerCase())
      })
    }

    // Sort by date (newest first)
    result.sort((a, b) => new Date(b.booking_date) - new Date(a.booking_date))

    setFilteredBookings(result)
    setCurrentPage(1) // Reset to first page when filters change
  }, [bookings, bookingStatuses, statusFilter, dateFilter, searchTerm])

  // Apply pagination
  useEffect(() => {
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    setPaginatedBookings(filteredBookings.slice(startIndex, endIndex))
  }, [filteredBookings, currentPage, pageSize])

  // Calculate total pages
  const totalPages = Math.ceil(filteredBookings.length / pageSize)

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  // Handle page size change
  const handlePageSizeChange = (size) => {
    setPageSize(size)
    setCurrentPage(1) // Reset to first page when page size changes
  }

  // Clear all filters
  const handleClearFilters = () => {
    setStatusFilter("")
    setDateFilter("")
    setSearchTerm("")
  }

  // Handle booking click
  const handleBookingClick = (booking) => {
    setSelectedBooking(booking)
    setStatusUpdated(false)
    setIsDetailModalOpen(true)
  }

  // Handle confirm booking
  const handleConfirmBooking = (bookingId) => {
    setBookingIdToAction(bookingId)
    setIsConfirmModalOpen(true)
  }

  // Handle reject booking
  const handleRejectBooking = (bookingId) => {
    setBookingIdToAction(bookingId)
    setIsRejectModalOpen(true)
  }

  // Confirm action handlers
  const confirmBookingAction = () => {
    // Update booking status
    setBookingStatuses((prevStatuses) => {
      const updatedStatuses = [...prevStatuses]
      const statusIndex = updatedStatuses.findIndex((status) => status.id === bookingIdToAction)

      if (statusIndex !== -1) {
        // Update existing status
        updatedStatuses[statusIndex] = {
          ...updatedStatuses[statusIndex],
          status: "confirmed",
          updated_at: new Date().toISOString(),
          message: "Booking đã được xác nhận.",
        }
      } else {
        // Add new status if it doesn't exist
        updatedStatuses.push({
          id: bookingIdToAction,
          status: "confirmed",
          updated_at: new Date().toISOString(),
          message: "Booking đã được xác nhận.",
        })
      }

      return updatedStatuses
    })

    setStatusUpdated(true)
    setIsConfirmModalOpen(false)
  }

  const rejectBookingAction = () => {
    // Update booking status
    setBookingStatuses((prevStatuses) => {
      const updatedStatuses = [...prevStatuses]
      const statusIndex = updatedStatuses.findIndex((status) => status.id === bookingIdToAction)

      if (statusIndex !== -1) {
        // Update existing status
        updatedStatuses[statusIndex] = {
          ...updatedStatuses[statusIndex],
          status: "cancelled",
          updated_at: new Date().toISOString(),
          message: "Booking đã bị hủy bởi huấn luyện viên.",
        }
      } else {
        // Add new status if it doesn't exist
        updatedStatuses.push({
          id: bookingIdToAction,
          status: "cancelled",
          updated_at: new Date().toISOString(),
          message: "Booking đã bị hủy bởi huấn luyện viên.",
        })
      }

      return updatedStatuses
    })

    setStatusUpdated(true)
    setIsRejectModalOpen(false)
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <div className="min-h-screen bg-slate-50 w-full">
      {/* Hero Background Image Section */}
      <div className="relative w-full h-[200px] md:h-[250px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/placeholder.svg?height=800&width=1600')",
            backgroundPosition: "center 30%",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/80 to-emerald-700/70"></div>
        </div>
        <div className="relative h-full flex flex-col justify-center items-center text-center px-4 z-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-white mb-2"
          >
            Quản lý lịch đặt
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-100 max-w-2xl"
          >
            Xem và quản lý các lịch đặt từ học viên
          </motion.p>
        </div>
      </div>

      <div className="w-full px-4 py-8 max-w-[2000px] mx-auto">
        {/* Filters */}
        <BookingFilter
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onClearFilters={handleClearFilters}
        />

        {/* Bookings count */}
        <div className="mb-4">
          <div className="text-sm text-slate-600">
            {loading ? (
              <div className="h-4 bg-slate-200 rounded w-48 animate-pulse"></div>
            ) : (
              `Hiển thị ${filteredBookings.length} lịch đặt`
            )}
          </div>
        </div>

        {/* Bookings grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <BookingSkeleton key={index} />
            ))}
          </div>
        ) : filteredBookings.length > 0 ? (
          <>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {paginatedBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onClick={handleBookingClick}
                  bookingStatuses={bookingStatuses}
                />
              ))}
            </motion.div>

            {/* Pagination */}
            {filteredBookings.length > pageSize && (
              <BookingPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                pageSize={pageSize}
                onPageSizeChange={handlePageSizeChange}
                totalItems={filteredBookings.length}
              />
            )}
          </>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-slate-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-slate-600 text-lg">Không tìm thấy lịch đặt nào phù hợp với tìm kiếm của bạn.</p>
            <button
              onClick={handleClearFilters}
              className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors inline-flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <BookingDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false)
          setStatusUpdated(false)
        }}
        booking={selectedBooking}
        onConfirm={handleConfirmBooking}
        onReject={handleRejectBooking}
        statusUpdated={statusUpdated}
        bookingStatuses={bookingStatuses}
      />

      <ConfirmActionModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmBookingAction}
        title="Xác nhận lịch đặt"
        message="Bạn có chắc chắn muốn xác nhận lịch đặt này? Học viên sẽ nhận được thông báo về việc xác nhận."
        confirmText="Xác nhận"
        confirmColor="emerald"
      />

      <ConfirmActionModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={rejectBookingAction}
        title="Từ chối lịch đặt"
        message="Bạn có chắc chắn muốn từ chối lịch đặt này? Hành động này không thể hoàn tác."
        confirmText="Từ chối"
        confirmColor="rose"
      />
    </div>
  )
}

export default CoachBookingsPage


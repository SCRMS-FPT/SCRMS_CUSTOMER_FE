"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import BookingCard from "../../components/bookinfo/booking-card";
import BookingDetailModal from "../../components/bookinfo/booking-detail-modal";
import BookingFilter from "../../components/bookinfo/booking-filter";
import BookingPagination from "../../components/bookinfo/booking-pagination";
import BookingSkeleton from "../../components/bookinfo/booking-skeleton";
import ConfirmActionModal from "../../components/bookinfo/confirm-action-modal";
import { userData } from "../../data/userData";
// Import Client from CoachApi
import { Client } from "../../API/CoachApi";
import { toast } from "react-hot-toast"; // Assuming you use toast for notifications

const CoachBookingsPage = () => {
  // Create API client instance
  const coachClient = new Client();

  // State for bookings data
  const [bookings, setBookings] = useState([]);
  const [bookingStatuses, setBookingStatuses] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for filters
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // State for API pagination
  const [currentPage, setCurrentPage] = useState(0); // Start from 0 instead of 1
  const [pageSize, setPageSize] = useState(8);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // State for modals
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [bookingIdToAction, setBookingIdToAction] = useState(null);

  // State for status updates
  const [statusUpdated, setStatusUpdated] = useState(false);

  // Fetch bookings when filters or pagination changes
  useEffect(() => {
    fetchBookings();
  }, [currentPage, pageSize, statusFilter, dateFilter]);

  // Function to fetch bookings from API
  const fetchBookings = async () => {
    setLoading(true);
    setError(null);

    try {
      // Prepare date filters if present
      const startDate = dateFilter ? new Date(dateFilter) : undefined;
      const endDate = dateFilter ? new Date(dateFilter) : undefined;
      if (endDate) {
        // Set end date to end of day
        endDate.setHours(23, 59, 59, 999);
      }

      // Call API with filters - passing currentPage directly (now 0-based)
      const response = await coachClient.getCoachBookings(
        startDate,
        endDate,
        statusFilter || undefined,
        currentPage, // Zero-based index
        pageSize,
        undefined, // sportId
        undefined // packageId
      );

      if (response && response.data) {
        setBookings(response.data);
        setTotalItems(response.count || 0);
        setTotalPages(Math.ceil((response.count || 0) / pageSize));

        // Initialize booking statuses based on API response
        const statuses = response.data.map((booking) => ({
          id: booking.id,
          status: booking.status,
          updated_at: new Date().toISOString(),
          message: `Trạng thái: ${getStatusMessage(booking.status)}`,
        }));
        setBookingStatuses(statuses);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Không thể tải danh sách lịch đặt. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get status message
  const getStatusMessage = (status) => {
    switch (status) {
      case "pending":
        return "Đang chờ xác nhận";
      case "confirmed":
        return "Đã xác nhận";
      case "cancelled":
        return "Đã hủy";
      case "completed":
        return "Đã hoàn thành";
      default:
        return "Không xác định";
    }
  };

  // Apply search filter locally
  useEffect(() => {
    if (!searchTerm) {
      setFilteredBookings(bookings);
      return;
    }

    const filtered = bookings.filter((booking) => {
      const user = userData.find((u) => u.id === booking.userId);
      if (!user) return false;

      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase());
    });

    setFilteredBookings(filtered);
  }, [bookings, searchTerm]);

  // Handle page change
  const handlePageChange = (page) => {
    // Adjust for zero-based indexing (page-1)
    const zeroBasedPage = page - 1;
    if (zeroBasedPage >= 0 && zeroBasedPage < totalPages) {
      setCurrentPage(zeroBasedPage);
    }
  };

  // Handle page size change
  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(0); // Reset to first page (index 0) when page size changes
  };

  // Clear all filters
  const handleClearFilters = () => {
    setStatusFilter("");
    setDateFilter("");
    setSearchTerm("");
    setCurrentPage(0); // Reset to first page (index 0)
  };

  // Handle booking click
  const handleBookingClick = (booking) => {
    setSelectedBooking(booking);
    setStatusUpdated(false);
    setIsDetailModalOpen(true);
  };

  // Handle confirm booking
  const handleConfirmBooking = (bookingId) => {
    setBookingIdToAction(bookingId);
    setIsConfirmModalOpen(true);
  };

  // Handle reject booking
  const handleRejectBooking = (bookingId) => {
    setBookingIdToAction(bookingId);
    setIsRejectModalOpen(true);
  };

  // Confirm action handlers with API calls
  const confirmBookingAction = async () => {
    try {
      setLoading(true);

      // Call API to update booking status
      await coachClient.updateBookingStatus(bookingIdToAction, "confirmed");

      // Update local state
      setBookingStatuses((prevStatuses) => {
        const updatedStatuses = [...prevStatuses];
        const statusIndex = updatedStatuses.findIndex(
          (status) => status.id === bookingIdToAction
        );

        if (statusIndex !== -1) {
          updatedStatuses[statusIndex] = {
            ...updatedStatuses[statusIndex],
            status: "confirmed",
            updated_at: new Date().toISOString(),
            message: "Booking đã được xác nhận.",
          };
        } else {
          updatedStatuses.push({
            id: bookingIdToAction,
            status: "confirmed",
            updated_at: new Date().toISOString(),
            message: "Booking đã được xác nhận.",
          });
        }

        return updatedStatuses;
      });

      // Update booking in the list
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingIdToAction
            ? { ...booking, status: "confirmed" }
            : booking
        )
      );

      toast.success("Đã xác nhận lịch đặt thành công");
      setStatusUpdated(true);
      setIsConfirmModalOpen(false);
    } catch (err) {
      console.error("Error confirming booking:", err);
      toast.error("Không thể xác nhận lịch đặt. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const rejectBookingAction = async () => {
    try {
      setLoading(true);

      // Call API to update booking status
      await coachClient.updateBookingStatus(bookingIdToAction, "cancelled");

      // Update local state
      setBookingStatuses((prevStatuses) => {
        const updatedStatuses = [...prevStatuses];
        const statusIndex = updatedStatuses.findIndex(
          (status) => status.id === bookingIdToAction
        );

        if (statusIndex !== -1) {
          updatedStatuses[statusIndex] = {
            ...updatedStatuses[statusIndex],
            status: "cancelled",
            updated_at: new Date().toISOString(),
            message: "Booking đã bị hủy bởi huấn luyện viên.",
          };
        } else {
          updatedStatuses.push({
            id: bookingIdToAction,
            status: "cancelled",
            updated_at: new Date().toISOString(),
            message: "Booking đã bị hủy bởi huấn luyện viên.",
          });
        }

        return updatedStatuses;
      });

      // Update booking in the list
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingIdToAction
            ? { ...booking, status: "cancelled" }
            : booking
        )
      );

      toast.success("Đã từ chối lịch đặt thành công");
      setStatusUpdated(true);
      setIsRejectModalOpen(false);
    } catch (err) {
      console.error("Error rejecting booking:", err);
      toast.error("Không thể từ chối lịch đặt. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Display error message if there's an error
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-red-500 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Đã xảy ra lỗi
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchBookings}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
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
          onStatusFilterChange={(value) => {
            setStatusFilter(value);
            setCurrentPage(0); // Reset page when filter changes
          }}
          dateFilter={dateFilter}
          onDateFilterChange={(value) => {
            setDateFilter(value);
            setCurrentPage(0); // Reset page when filter changes
          }}
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
              `Hiển thị ${filteredBookings.length} lịch đặt (tổng ${totalItems})`
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
              {filteredBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onClick={handleBookingClick}
                  bookingStatuses={bookingStatuses}
                />
              ))}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <BookingPagination
                currentPage={currentPage + 1} // Convert zero-based index to 1-based for display
                totalPages={totalPages}
                onPageChange={handlePageChange} // This now expects a 1-based page number
                pageSize={pageSize}
                onPageSizeChange={handlePageSizeChange}
                totalItems={totalItems}
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
            <p className="text-slate-600 text-lg">
              Không tìm thấy lịch đặt nào phù hợp với tìm kiếm của bạn.
            </p>
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
          setIsDetailModalOpen(false);
          setStatusUpdated(false);
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
  );
};

export default CoachBookingsPage;

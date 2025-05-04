"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import BookingCard from "../../components/bookinfo/booking-card";
import BookingDetailModal from "../../components/bookinfo/booking-detail-modal";
import BookingFilter from "../../components/bookinfo/BookingFilter";
import BookingPagination from "../../components/bookinfo/booking-pagination";
import BookingSkeleton from "../../components/bookinfo/booking-skeleton";
import ConfirmActionModal from "../../components/bookinfo/confirm-action-modal";
import { Client } from "../../API/CoachApi";
import { Client as IdentityClient } from "../../API/IdentityApi";
import { toast } from "react-hot-toast";

const CoachBookingsPage = () => {
  const coachClient = new Client();
  const identityClient = new IdentityClient();

  const isMountedRef = useRef(true);

  const [bookings, setBookings] = useState([]);
  const [bookingStatuses, setBookingStatuses] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProfiles, setUserProfiles] = useState({});
  const [statusFilter, setStatusFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(8);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [bookingIdToAction, setBookingIdToAction] = useState(null);
  const [bookingDetail, setBookingDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [statusUpdated, setStatusUpdated] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      if (userProfiles[userId]) {
        return userProfiles[userId];
      }

      const profile = await identityClient.profile(userId);

      if (isMountedRef.current) {
        setUserProfiles((prev) => ({
          ...prev,
          [userId]: profile,
        }));
      }

      return profile;
    } catch (error) {
      console.error(`Error fetching profile for user ${userId}:`, error);
      return null;
    }
  };

  const formatDateForApi = (dateString) => {
    if (!dateString) return undefined;

    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const calculateEndDate = (startDate) => {
    if (!startDate) return undefined;

    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + 1);

    const year = end.getFullYear();
    const month = String(end.getMonth() + 1).padStart(2, "0");
    const day = String(end.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    fetchBookings();
  }, [currentPage, pageSize, statusFilter, startDateFilter, endDateFilter]);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);

    try {
      // Format dates as simple strings YYYY-MM-DD for API
      const startDateFormatted = startDateFilter
        ? formatDateForApi(startDateFilter)
        : undefined;

      // If endDate is not provided but startDate is, automatically add 1 day to startDate
      const endDateFormatted = endDateFilter
        ? formatDateForApi(endDateFilter)
        : startDateFilter
        ? calculateEndDate(startDateFilter)
        : undefined;

      console.log("Sending date filters:", {
        startDate: startDateFormatted,
        endDate: endDateFormatted,
      });

      // Use the API client with string dates instead of Date objects
      const response = await coachClient.getCoachBookings(
        startDateFormatted,
        endDateFormatted,
        statusFilter || undefined,
        currentPage,
        pageSize,
        undefined,
        undefined
      );

      if (response && response.data) {
        setBookings(response.data);
        setFilteredBookings(response.data);
        setTotalItems(response.count || 0);
        setTotalPages(Math.ceil((response.count || 0) / pageSize));

        const statuses = response.data.map((booking) => ({
          id: booking.id,
          status: booking.status,
          updated_at: new Date().toISOString(),
          message: `Trạng thái: ${getStatusMessage(booking.status)}`,
        }));
        setBookingStatuses(statuses);

        const userIds = [
          ...new Set(response.data.map((booking) => booking.userId)),
        ];

        for (const userId of userIds) {
          if (!userProfiles[userId]) {
            fetchUserProfile(userId);
          }
        }
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Không thể tải danh sách lịch đặt. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case "pending":
        return "Đang chờ xác nhận";
      case "completed":
        return "Đã hoàn thành";
      default:
        return "Không xác định";
    }
  };

  useEffect(() => {
    if (!searchTerm) {
      setFilteredBookings(bookings);
      return;
    }

    const filtered = bookings.filter((booking) => {
      const user = userProfiles[booking.userId];
      if (!user) return false;

      const userName =
        user.firstName && user.lastName
          ? `${user.firstName} ${user.lastName}`.toLowerCase()
          : (user.fullName || "").toLowerCase();

      return userName.includes(searchTerm.toLowerCase());
    });

    setFilteredBookings(filtered);
  }, [bookings, searchTerm, userProfiles]);

  const handlePageChange = (page) => {
    const zeroBasedPage = page - 1;
    if (zeroBasedPage >= 0 && zeroBasedPage < totalPages) {
      setCurrentPage(zeroBasedPage);
    }
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(0);
  };

  const handleClearFilters = () => {
    setStatusFilter("");
    setStartDateFilter("");
    setEndDateFilter("");
    setSearchTerm("");
    setCurrentPage(0);
  };

  const handleStartDateChange = (date) => {
    setStartDateFilter(date);

    if (endDateFilter && new Date(endDateFilter) < new Date(date)) {
      setEndDateFilter("");
    }

    setCurrentPage(0);
  };

  const handleEndDateChange = (date) => {
    setEndDateFilter(date);
    setCurrentPage(0);
  };

  const fetchBookingDetails = async (bookingId) => {
    setLoadingDetail(true);
    try {
      const detail = await coachClient.getBookingById(bookingId);
      setBookingDetail(detail);
      return detail;
    } catch (err) {
      console.error("Error fetching booking details:", err);
      toast.error("Không thể tải chi tiết lịch đặt. Vui lòng thử lại sau.");
      return null;
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleBookingClick = async (booking) => {
    setSelectedBooking(booking);

    const detail = await fetchBookingDetails(booking.id);

    const enrichedBooking = {
      ...booking,
      ...detail,
      user: userProfiles[booking.userId] || null,
    };

    setSelectedBooking(enrichedBooking);
    setStatusUpdated(false);
    setIsDetailModalOpen(true);
  };

  const handleConfirmBooking = (bookingId) => {
    setBookingIdToAction(bookingId);
    setIsConfirmModalOpen(true);
  };

  const handleRejectBooking = (bookingId) => {
    setBookingIdToAction(bookingId);
    setIsRejectModalOpen(true);
  };

  const handleCancelBooking = (bookingId, reason) => {
    setBookingIdToAction(bookingId);

    if (reason) {
      setCancellationReason(reason);
      cancelBookingWithReason(bookingId, reason);
    } else {
      setIsCancelModalOpen(true);
    }
  };

  const confirmBookingAction = async () => {
    try {
      setLoading(true);

      await coachClient.updateBookingStatus(bookingIdToAction, "confirmed");

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
      setIsDetailModalOpen(false);
      fetchBookings();
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

      await coachClient.updateBookingStatus(bookingIdToAction, "cancelled");

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
            message: "Booking đã bị từ chối bởi huấn luyện viên.",
          };
        } else {
          updatedStatuses.push({
            id: bookingIdToAction,
            status: "cancelled",
            updated_at: new Date().toISOString(),
            message: "Booking đã bị từ chối bởi huấn luyện viên.",
          });
        }

        return updatedStatuses;
      });

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
      setIsDetailModalOpen(false);
      fetchBookings();
    } catch (err) {
      console.error("Error rejecting booking:", err);
      toast.error("Không thể từ chối lịch đặt. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const cancelBookingWithReason = async (bookingId, reason) => {
    try {
      setLoading(true);

      const cancelRequest = {
        cancellationReason: reason || "Huấn luyện viên hủy lịch đặt",
      };
      await coachClient.cancelCoachBooking(bookingId, cancelRequest);

      setBookingStatuses((prevStatuses) => {
        const updatedStatuses = [...prevStatuses];
        const statusIndex = updatedStatuses.findIndex(
          (status) => status.id === bookingId
        );

        if (statusIndex !== -1) {
          updatedStatuses[statusIndex] = {
            ...updatedStatuses[statusIndex],
            status: "cancelled",
            updated_at: new Date().toISOString(),
            message: "Booking đã bị hủy bởi huấn luyện viên.",
          };
        }

        return updatedStatuses;
      });

      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: "cancelled", cancellationReason: reason }
            : booking
        )
      );

      toast.success("Đã hủy lịch đặt thành công");
      setStatusUpdated(true);
      setIsCancelModalOpen(false);
      setIsDetailModalOpen(false);
      fetchBookings();
    } catch (err) {
      console.error("Error cancelling booking:", err);
      toast.error("Không thể hủy lịch đặt. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
      setCancellationReason("");
    }
  };

  const cancelBookingAction = async () => {
    await cancelBookingWithReason(bookingIdToAction, cancellationReason);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

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
        <BookingFilter
          statusFilter={statusFilter}
          onStatusFilterChange={(value) => {
            setStatusFilter(value);
            setCurrentPage(0);
          }}
          startDateFilter={startDateFilter}
          endDateFilter={endDateFilter}
          onStartDateFilterChange={handleStartDateChange}
          onEndDateFilterChange={handleEndDateChange}
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onClearFilters={handleClearFilters}
        />

        <div className="mb-4">
          <div className="text-sm text-slate-600">
            {loading ? (
              <div className="h-4 bg-slate-200 rounded w-48 animate-pulse"></div>
            ) : (
              `Hiển thị ${filteredBookings.length} lịch đặt (tổng ${totalItems})`
            )}
          </div>
        </div>

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
                  userData={userProfiles[booking.userId]}
                />
              ))}
            </motion.div>

            {totalPages > 1 && (
              <BookingPagination
                currentPage={currentPage + 1}
                totalPages={totalPages}
                onPageChange={handlePageChange}
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

      <BookingDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setStatusUpdated(false);
          setBookingDetail(null);
        }}
        booking={selectedBooking}
        bookingDetail={bookingDetail}
        loading={loadingDetail}
        onConfirm={handleConfirmBooking}
        onReject={handleRejectBooking}
        onCancel={handleCancelBooking}
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

      <ConfirmActionModal
        isOpen={isCancelModalOpen}
        onClose={() => {
          setIsCancelModalOpen(false);
          setCancellationReason("");
        }}
        onConfirm={cancelBookingAction}
        title="Hủy lịch đặt"
        message="Vui lòng nhập lý do hủy buổi học này:"
        confirmText="Hủy buổi học"
        confirmColor="rose"
        showReasonInput={true}
        reason={cancellationReason}
        onReasonChange={(e) => setCancellationReason(e.target.value)}
      />
    </div>
  );
};

export default CoachBookingsPage;

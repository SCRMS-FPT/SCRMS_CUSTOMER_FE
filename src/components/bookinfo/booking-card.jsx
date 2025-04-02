"use client";
import { motion } from "framer-motion";
import BookingStatusBadge from "./booking-status-badge";
import PropTypes from "prop-types";
import placeholder_img from "@/assets/default_avatar.jpg"

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// Helper function to format dates with proper error handling
const formatDate = (dateValue, timeStr, isFullFormat = true) => {
  // Guard against null or undefined values
  if (!dateValue) {
    return "Not scheduled";
  }

  try {
    let date;

    // Handle different date formats: Date object, string, or combined date+time
    if (dateValue instanceof Date) {
      // If it's already a Date object, use it directly
      date = new Date(dateValue);

      // If we have a time string, we need to set the time components
      if (timeStr) {
        const [hours, minutes, seconds] = timeStr.split(":").map(Number);
        date.setHours(hours || 0, minutes || 0, seconds || 0);
      }
    } else if (typeof dateValue === "string") {
      // If it's a string date, combine with time if available
      const fullDateTimeStr = timeStr ? `${dateValue}T${timeStr}` : dateValue;
      date = new Date(fullDateTimeStr);
    } else {
      throw new Error("Unsupported date format");
    }

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date");
    }

    // Format the date based on whether we want full format or just time
    if (isFullFormat) {
      return date.toLocaleDateString("vi-VN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } else {
      // For time-only format
      return date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  } catch (error) {
    console.error(
      "Error formatting date:",
      error,
      "Date value was:",
      dateValue,
      "Time string was:",
      timeStr
    );
    return "Invalid date";
  }
};

const BookingCard = ({ booking, onClick, bookingStatuses, userData }) => {
  // Use passed userData instead of static import
  const user = userData || {};
  const userName = user && user.firstName && user.lastName
  ? `${user.firstName} ${user.lastName}`
  : user && user.fullName 
    ? user.fullName 
    : "Không xác định";

  // Find booking status from bookingStatuses prop
  const bookingStatus = bookingStatuses.find(
    (status) => status.id === booking.id
  ) || { status: booking.status || "pending" };
  
  // Format time slot display
  const timeSlot =
    booking.startTime && booking.endTime
      ? `${formatDate(
          booking.bookingDate,
          booking.startTime,
          false
        )} - ${formatDate(booking.bookingDate, booking.endTime, false)}`
      : "Không xác định";

  return (
    <motion.div
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <div className="h-3 bg-gradient-to-r from-emerald-500 to-emerald-600"></div>
        <div className="absolute bottom-0 left-0 transform translate-y-1/2 mr-4">
          <BookingStatusBadge status={bookingStatus.status} />
        </div>
      </div>

      <div className="p-6 pt-5">
        <div className="flex items-center mb-4">
          <img
            src={user.avatar || placeholder_img}
            alt={userName}
            className="w-12 h-12 rounded-full object-cover mr-3 border-2 border-emerald-100"
          />
          <div>
            <h3 className="text-lg font-bold text-slate-800">{userName}</h3>
            <p className="text-sm text-slate-500">
              Mã booking:{" "}
              <span className="text-emerald-600 font-medium">
                {booking.id.split("-").pop()}
              </span>
            </p>
          </div>
        </div>

        <div className="space-y-3 mb-4 bg-slate-50 p-3 rounded-lg">
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
            <span className="text-slate-700">
              {formatDate(booking.bookingDate, null, true)}
            </span>
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
            <span className="text-slate-700">{timeSlot}</span>
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
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-slate-700 font-medium">
              {formatCurrency(booking.totalPrice)}
            </span>
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={() => onClick(booking)}
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors duration-300 flex items-center justify-center shadow-sm hover:shadow"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            Xem chi tiết
          </button>
        </div>
      </div>
    </motion.div>
  );
};

BookingCard.propTypes = {
  booking: PropTypes.shape({
    id: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    bookingDate: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]).isRequired,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    totalPrice: PropTypes.number.isRequired,
    status: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
  bookingStatuses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    })
  ).isRequired,
  userData: PropTypes.object,
};

export default BookingCard;

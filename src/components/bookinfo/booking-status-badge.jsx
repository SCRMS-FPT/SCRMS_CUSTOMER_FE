const BookingStatusBadge = ({ status }) => {
  const getStatusConfig = () => {
    switch (status.toLowerCase()) {
      case "pending":
        return {
          label: "Chờ xác nhận",
          bgColor: "bg-amber-100",
          textColor: "text-amber-800",
          borderColor: "border-amber-200",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 mr-1"
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
          ),
        }
      case "confirmed":
        return {
          label: "Đã xác nhận",
          bgColor: "bg-emerald-100",
          textColor: "text-emerald-800",
          borderColor: "border-emerald-200",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ),
        }
      case "cancelled":
        return {
          label: "Đã hủy",
          bgColor: "bg-rose-100",
          textColor: "text-rose-800",
          borderColor: "border-rose-200",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ),
        }
      case "completed":
        return {
          label: "Hoàn thành",
          bgColor: "bg-blue-100",
          textColor: "text-blue-800",
          borderColor: "border-blue-200",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
        }
      default:
        return {
          label: status,
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
          borderColor: "border-gray-200",
          icon: null,
        }
    }
  }

  const { label, bgColor, textColor, borderColor, icon } = getStatusConfig()

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor} border ${borderColor}`}
    >
      {icon}
      {label}
    </span>
  )
}

export default BookingStatusBadge


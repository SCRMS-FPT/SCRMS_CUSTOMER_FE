"use client"

import { useState } from "react"
import { Calendar, Clock, Info, Mail, ExternalLink, Award, MapPin, Package, ChevronDown, ChevronUp } from "lucide-react"

// Hàm định dạng tiền tệ
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Hàm định dạng trạng thái
const getStatusDisplay = (status) => {
  switch (status) {
    case "Paid":
      return {
        text: "Đã thanh toán",
        color: "bg-green-100 text-green-800 border-green-200",
      }
    case "Pending":
      return {
        text: "Chờ thanh toán",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      }
    case "Active":
      return {
        text: "Đang hoạt động",
        color: "bg-green-100 text-green-800 border-green-200",
      }
    case "Expired":
      return {
        text: "Đã hết hạn",
        color: "bg-red-100 text-red-800 border-red-200",
      }
    default:
      return {
        text: status,
        color: "bg-gray-100 text-gray-800 border-gray-200",
      }
  }
}

// Hàm định dạng ngày tháng
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" }
  return new Date(dateString).toLocaleDateString("vi-VN", options)
}

const TransactionCard = ({ transaction, type }) => {
  const [showDetails, setShowDetails] = useState(false)

  // Xác định các trường hiển thị dựa vào loại giao dịch
  const getDisplayFields = () => {
    switch (type) {
      case "coach":
        return {
          title: transaction.coach_name,
          subtitle: `Buổi tập: ${formatDate(transaction.date)}`,
          timeInfo: transaction.time_slot,
          status: transaction.payment_status,
          statusDisplay: getStatusDisplay(transaction.payment_status),
          icon: <Award className="w-10 h-10 text-blue-500" />,
          id: transaction.id,
          price: transaction.total_price,
          details: transaction.details,
          contact: transaction.contact_support,
        }
      case "court":
        return {
          title: transaction.court_name,
          subtitle: `Đặt sân: ${formatDate(transaction.date)}`,
          timeInfo: transaction.time_slot,
          status: transaction.payment_status,
          statusDisplay: getStatusDisplay(transaction.payment_status),
          icon: <MapPin className="w-10 h-10 text-red-500" />,
          id: transaction.id,
          price: transaction.total_price,
          details: transaction.details,
          contact: transaction.contact_support,
        }
      case "package":
        return {
          title: transaction.package_name,
          subtitle: `Ngày mua: ${formatDate(transaction.purchase_date)}`,
          timeInfo: `Hết hạn: ${formatDate(transaction.expiry_date)}`,
          status: transaction.status,
          statusDisplay: getStatusDisplay(transaction.status),
          icon: <Package className="w-10 h-10 text-purple-500" />,
          id: transaction.id,
          price: transaction.total_price,
          details: transaction.details,
          contact: transaction.contact_support,
        }
      default:
        return {
          title: "Unknown",
          subtitle: "",
          timeInfo: "",
          status: "Unknown",
          statusDisplay: getStatusDisplay("Unknown"),
          icon: <Info className="w-10 h-10 text-gray-500" />,
          id: "",
          price: 0,
          details: "",
          contact: "",
        }
    }
  }

  const { title, subtitle, timeInfo, status, statusDisplay, icon, id, price, details, contact } = getDisplayFields()

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg mb-4">
      {/* Card Header - Always visible */}
      <div className="p-4 flex items-center gap-4 cursor-pointer" onClick={() => setShowDetails(!showDetails)}>
        <div className="flex-shrink-0 bg-gray-50 p-2 rounded-lg">{icon}</div>
        <div className="flex-grow min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800 truncate">{title}</h3>
            <span
              className={`ml-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusDisplay.color}`}
            >
              {statusDisplay.text}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600 mt-1">
            <Calendar className="w-4 h-4 mr-1 text-gray-500 flex-shrink-0" />
            <span className="truncate">{subtitle}</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-gray-500">ID: {id}</p>
            <p className="font-bold text-blue-700">{formatCurrency(price)}</p>
          </div>
        </div>
        <div className="flex-shrink-0 ml-2">
          {showDetails ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </div>
      </div>

      {/* Card Details - Only visible when expanded */}
      {showDetails && (
        <div className="border-t border-gray-100 p-4 bg-gray-50 animate-fadeIn">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Thông tin chi tiết</h4>
              {timeInfo && (
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Clock className="w-4 h-4 mr-2 text-gray-500" />
                  <span>{timeInfo}</span>
                </div>
              )}
              <div className="bg-white p-3 rounded-lg border border-gray-200 text-sm text-gray-700">{details}</div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Thông tin liên hệ</h4>
              <div className="bg-white p-3 rounded-lg border border-gray-200 text-sm">
                <div className="flex items-center text-gray-600">
                  <Mail className="w-4 h-4 mr-2 text-gray-500" />
                  <a href={`mailto:${contact}`} className="text-blue-600 hover:underline">
                    {contact}
                  </a>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Xem đầy đủ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TransactionCard


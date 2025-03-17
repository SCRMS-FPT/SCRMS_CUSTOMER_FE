"use client"
import {
  Edit,
  Trash2,
  Calendar,
  Tag,
  Percent,
  DollarSign,
  Clock,
  AlertCircle,
  CheckCircle,
  ArrowUpRight,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import { courtsData } from "../data/courtsData1"

const PromotionTable = ({ promotions, onEdit, onDelete, pagination, onPageChange, onItemsPerPageChange }) => {
  const { currentPage, totalPages, itemsPerPage, totalItems, startItem, endItem } = pagination

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN")
  }

  const formatDiscountValue = (type, value) => {
    if (type === "percentage") {
      return `${value}%`
    } else {
      return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value)
    }
  }

  const getPromotionStatus = (validFrom, validTo) => {
    const now = new Date()
    const startDate = new Date(validFrom)
    const endDate = new Date(validTo)

    if (now < startDate) {
      return {
        status: "upcoming",
        label: "Sắp diễn ra",
        icon: <Clock className="h-4 w-4 text-yellow-500" />,
        color: "bg-yellow-100 text-yellow-800",
      }
    } else if (now > endDate) {
      return {
        status: "expired",
        label: "Đã hết hạn",
        icon: <AlertCircle className="h-4 w-4 text-red-500" />,
        color: "bg-red-100 text-red-800",
      }
    } else {
      return {
        status: "active",
        label: "Đang hoạt động",
        icon: <CheckCircle className="h-4 w-4 text-green-500" />,
        color: "bg-green-100 text-green-800",
      }
    }
  }

  const getCourtName = (courtId) => {
    const court = courtsData.find((court) => court.courtId === courtId)
    return court ? court.name : "Không xác định"
  }

  const getCourtStatus = (courtId) => {
    const court = courtsData.find((court) => court.courtId === courtId)
    if (!court) return { label: "Không xác định", color: "bg-gray-100 text-gray-800" }

    return court.status === "open"
      ? { label: "Đang mở", color: "bg-green-100 text-green-800" }
      : { label: "Đã đóng", color: "bg-red-100 text-red-800" }
  }

  // Tạo mảng các số trang để hiển thị
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      // Hiển thị tất cả các trang nếu tổng số trang ít hơn hoặc bằng maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      // Tính toán các trang cần hiển thị
      let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2))
      let endPage = startPage + maxPagesToShow - 1

      if (endPage > totalPages) {
        endPage = totalPages
        startPage = Math.max(1, endPage - maxPagesToShow + 1)
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i)
      }

      // Thêm dấu ... nếu cần
      if (startPage > 1) {
        pageNumbers.unshift("...")
        pageNumbers.unshift(1)
      }

      if (endPage < totalPages) {
        pageNumbers.push("...")
        pageNumbers.push(totalPages)
      }
    }

    return pageNumbers
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã KM</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sân áp dụng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Loại giảm giá
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giá trị
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thời gian hiệu lực
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {promotions.length > 0 ? (
              promotions.map((promotion) => {
                const status = getPromotionStatus(promotion.valid_from, promotion.valid_to)
                const courtStatus = getCourtStatus(promotion.courtId)
                return (
                  <tr key={promotion.promotionId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Tag className="h-4 w-4 text-blue-500 mr-2" />
                        <span className="text-sm font-medium text-gray-900">{promotion.promotionId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-indigo-500 mr-2" />
                          <span className="text-sm font-medium text-gray-900">{getCourtName(promotion.courtId)}</span>
                        </div>
                        <span
                          className={`text-xs mt-1 px-2 py-0.5 rounded-full inline-flex items-center w-fit ${courtStatus.color}`}
                        >
                          {courtStatus.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">{promotion.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        {promotion.discount_type === "percentage" ? (
                          <>
                            <Percent className="h-4 w-4 text-purple-500 mr-2" /> Phần trăm
                          </>
                        ) : (
                          <>
                            <DollarSign className="h-4 w-4 text-green-500 mr-2" /> Số tiền cố định
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">
                        {formatDiscountValue(promotion.discount_type, promotion.discount_value)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                          <span>Từ: {formatDate(promotion.valid_from)}</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                          <span>Đến: {formatDate(promotion.valid_to)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}
                      >
                        {status.icon}
                        <span className="ml-1">{status.label}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => onEdit(promotion)}
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                          title="Chỉnh sửa"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDelete(promotion.promotionId)}
                          className="text-red-600 hover:text-red-900 flex items-center"
                          title="Xóa"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 flex items-center" title="Xem chi tiết">
                          <ArrowUpRight className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-10 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <AlertCircle className="h-10 w-10 text-gray-400 mb-2" />
                    <p>Không tìm thấy khuyến mãi nào</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center text-sm text-gray-700">
              <span className="hidden sm:inline">Hiển thị</span>
              <select
                className="mx-2 px-2 py-1 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={itemsPerPage}
                onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span className="hidden sm:inline">mục trên mỗi trang</span>
              <span className="sm:ml-4">
                {startItem}-{endItem} / {totalItems} mục
              </span>
            </div>

            <div className="flex items-center justify-center">
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => onPageChange(1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-gray-50"
                    }`}
                >
                  <span className="sr-only">Trang đầu</span>
                  <ChevronsLeft className="h-5 w-5" />
                </button>

                <button
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-gray-50"
                    }`}
                >
                  <span className="sr-only">Trang trước</span>
                  <ChevronLeft className="h-5 w-5" />
                </button>

                {/* Page numbers */}
                {getPageNumbers().map((pageNum, index) => {
                  if (pageNum === "...") {
                    return (
                      <span
                        key={`ellipsis-${index}`}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                      >
                        ...
                      </span>
                    )
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === pageNum
                        ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}

                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-gray-50"
                    }`}
                >
                  <span className="sr-only">Trang sau</span>
                  <ChevronRight className="h-5 w-5" />
                </button>

                <button
                  onClick={() => onPageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-gray-50"
                    }`}
                >
                  <span className="sr-only">Trang cuối</span>
                  <ChevronsRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PromotionTable


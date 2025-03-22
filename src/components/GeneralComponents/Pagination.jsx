"use client"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

const Pagination = ({ currentPage, totalPages, onPageChange, itemsPerPage, totalItems, onItemsPerPageChange }) => {
  // Tạo mảng các số trang để hiển thị
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 5 // Số lượng nút trang tối đa hiển thị

    if (totalPages <= maxPagesToShow) {
      // Nếu tổng số trang ít hơn hoặc bằng số lượng nút tối đa, hiển thị tất cả
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      // Nếu tổng số trang nhiều hơn số lượng nút tối đa
      // Luôn hiển thị trang đầu, trang cuối và các trang xung quanh trang hiện tại
      const leftSiblingIndex = Math.max(currentPage - 1, 1)
      const rightSiblingIndex = Math.min(currentPage + 1, totalPages)

      // Kiểm tra xem có nên hiển thị dấu "..." không
      const shouldShowLeftDots = leftSiblingIndex > 2
      const shouldShowRightDots = rightSiblingIndex < totalPages - 1

      if (!shouldShowLeftDots && shouldShowRightDots) {
        // Hiển thị các trang đầu và dấu "..." bên phải
        for (let i = 1; i <= 3; i++) {
          pageNumbers.push(i)
        }
        pageNumbers.push("...")
        pageNumbers.push(totalPages)
      } else if (shouldShowLeftDots && !shouldShowRightDots) {
        // Hiển thị dấu "..." bên trái và các trang cuối
        pageNumbers.push(1)
        pageNumbers.push("...")
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pageNumbers.push(i)
        }
      } else if (shouldShowLeftDots && shouldShowRightDots) {
        // Hiển thị dấu "..." ở cả hai bên
        pageNumbers.push(1)
        pageNumbers.push("...")
        pageNumbers.push(currentPage - 1)
        pageNumbers.push(currentPage)
        pageNumbers.push(currentPage + 1)
        pageNumbers.push("...")
        pageNumbers.push(totalPages)
      } else {
        // Hiển thị các trang đầu và cuối
        for (let i = 1; i <= totalPages; i++) {
          pageNumbers.push(i)
        }
      }
    }

    return pageNumbers
  }

  const pageNumbers = getPageNumbers()

  // Tính toán phạm vi hiển thị (ví dụ: "Hiển thị 1-10 trên 100 mục")
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div className="mt-6 flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-md border border-gray-200">
      <div className="text-sm text-gray-600 mb-4 sm:mb-0">
        Hiển thị {startItem}-{endItem} trên {totalItems} mục
      </div>

      <div className="flex items-center space-x-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-md ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"
            }`}
          aria-label="Trang đầu tiên"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-md ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"
            }`}
          aria-label="Trang trước"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {pageNumbers.map((pageNumber, index) =>
          pageNumber === "..." ? (
            <span key={`ellipsis-${index}`} className="px-3 py-1 text-gray-500">
              ...
            </span>
          ) : (
            <button
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              className={`w-8 h-8 flex items-center justify-center rounded-md ${currentPage === pageNumber ? "bg-blue-600 text-white font-medium" : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              {pageNumber}
            </button>
          ),
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-md ${currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"
            }`}
          aria-label="Trang sau"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-md ${currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"
            }`}
          aria-label="Trang cuối cùng"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>

      <div className="hidden sm:flex items-center ml-4">
        <span className="text-sm text-gray-600 mr-2">Hiển thị:</span>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="bg-white border border-gray-300 text-gray-700 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block p-1"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>
    </div>
  )
}

export default Pagination


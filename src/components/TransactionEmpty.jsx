"use client"
import { FileX, Search, RefreshCw } from "lucide-react"

const TransactionEmpty = ({ message = "Không tìm thấy giao dịch nào", isSearchResult = false, onReset = null }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-xl shadow-md border border-gray-200">
      {isSearchResult ? (
        <Search className="w-16 h-16 text-gray-300 mb-4" />
      ) : (
        <FileX className="w-16 h-16 text-gray-300 mb-4" />
      )}
      <h3 className="text-lg font-medium text-gray-700 mb-2">Không có dữ liệu</h3>
      <p className="text-gray-500 text-center mb-6">{message}</p>

      {onReset && (
        <button
          onClick={onReset}
          className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Đặt lại bộ lọc
        </button>
      )}
    </div>
  )
}

export default TransactionEmpty


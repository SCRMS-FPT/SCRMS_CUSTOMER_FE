"use client"
import { Search, X } from "lucide-react"

const TransactionSearch = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="relative mb-6">
      <div
        className="absolute inset-0 rounded-xl overflow-hidden z-0"
        style={{
          backgroundImage:
            "url('/src/assets/HLV/2q.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          // opacity: 0.15,
        }}
      />
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
        <Search className="w-5 h-5 text-gray-600" />
      </div>
      <input
        type="text"
        className="relative bg-white/80 backdrop-blur-sm border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-10 p-3 shadow-sm transition-all duration-200 focus:shadow-md z-10"
        placeholder="Tìm kiếm theo ID, tên, ngày..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {searchQuery && (
        <button
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600 hover:text-gray-800 z-10"
          onClick={() => setSearchQuery("")}
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}

export default TransactionSearch


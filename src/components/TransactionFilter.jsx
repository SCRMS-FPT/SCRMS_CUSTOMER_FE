"use client"
import { Users, MapPin, Package, LayoutGrid } from "lucide-react"

const TransactionFilter = ({ activeFilter, setActiveFilter, totalCounts }) => {
  const filters = [
    { id: "all", label: "Tất cả", count: totalCounts.all, icon: <LayoutGrid className="w-4 h-4 mr-1" /> },
    { id: "coach", label: "Đặt HLV", count: totalCounts.coach, icon: <Users className="w-4 h-4 mr-1" /> },
    { id: "court", label: "Đặt sân", count: totalCounts.court, icon: <MapPin className="w-4 h-4 mr-1" /> },
    { id: "package", label: "Gói tập", count: totalCounts.package, icon: <Package className="w-4 h-4 mr-1" /> },
  ]

  return (
    <div className="flex flex-wrap gap-3">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => setActiveFilter(filter.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center ${activeFilter === filter.id
            ? "bg-blue-600 text-white shadow-md"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
        >
          {filter.icon}
          {filter.label}{" "}
          {filter.count > 0 && (
            <span
              className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${activeFilter === filter.id ? "bg-white text-blue-600" : "bg-gray-200 text-gray-700"}`}
            >
              {filter.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

export default TransactionFilter


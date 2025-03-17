"use client"

import { useState } from "react"
import { Search, Filter, X, MapPin, Building } from "lucide-react"
import { courtsData } from "../data/courtsData1"
import { sportsCentersData } from "../data/sportsCentersData"

const PromotionSearch = ({ onSearch, onFilter }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchType, setSearchType] = useState("all")
  const [activeFilters, setActiveFilters] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCourt, setSelectedCourt] = useState("")
  const [selectedCenter, setSelectedCenter] = useState("")
  const [filteredCourts, setFilteredCourts] = useState(courtsData)

  const handleSearch = (e) => {
    e.preventDefault()
    onSearch(searchTerm, searchType)
  }

  const addFilter = (type, value, label) => {
    const newFilter = { type, value, label }
    const updatedFilters = [...activeFilters, newFilter]
    setActiveFilters(updatedFilters)
    if (onFilter) onFilter(updatedFilters)
    setShowFilters(false)
  }

  const removeFilter = (index) => {
    const updatedFilters = activeFilters.filter((_, i) => i !== index)
    setActiveFilters(updatedFilters)
    if (onFilter) onFilter(updatedFilters)
  }

  const clearAllFilters = () => {
    setActiveFilters([])
    if (onFilter) onFilter([])
  }

  const handleCourtFilter = () => {
    if (selectedCourt) {
      const court = courtsData.find((c) => c.courtId === selectedCourt)
      if (court) {
        addFilter("courtId", selectedCourt, `Sân: ${court.name}`)
        setSelectedCourt("")
      }
    }
  }

  const handleCenterFilter = () => {
    if (selectedCenter) {
      const center = sportsCentersData.find((c) => c.centerId === selectedCenter)
      if (center) {
        addFilter("sports_center_id", selectedCenter, `Trung tâm: ${center.name}`)
        setSelectedCenter("")

        // Filter courts by selected center
        const courts = courtsData.filter((c) => c.sports_center_id === selectedCenter)
        setFilteredCourts(courts)
      }
    } else {
      setFilteredCourts(courtsData)
    }
  }

  const handleCenterChange = (e) => {
    const centerId = e.target.value
    setSelectedCenter(centerId)

    if (centerId) {
      const courts = courtsData.filter((c) => c.sports_center_id === centerId)
      setFilteredCourts(courts)
      setSelectedCourt("")
    } else {
      setFilteredCourts(courtsData)
    }
  }

  return (
    <div className="bg-white p-5 rounded-lg shadow-md mb-6">
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm khuyến mãi..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="md:w-48">
          <select
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option value="all">Tất cả</option>
            <option value="promotionId">Mã khuyến mãi</option>
            <option value="description">Mô tả</option>
            <option value="discount_type">Loại giảm giá</option>
            <option value="courtId">Sân áp dụng</option>
            <option value="sports_center_id">Trung tâm thể thao</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            <span>Tìm kiếm</span>
          </button>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="px-3 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-200 flex items-center"
          >
            <Filter className="h-5 w-5" />
          </button>
        </div>
      </form>

      {/* Active filters */}
      {activeFilters.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-500">Bộ lọc đang áp dụng:</span>
          {activeFilters.map((filter, index) => (
            <div
              key={index}
              className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
            >
              <span>{filter.label}</span>
              <button onClick={() => removeFilter(index)} className="ml-1 rounded-full hover:bg-blue-100 p-0.5">
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          <button onClick={clearAllFilters} className="text-sm text-red-600 hover:text-red-800 ml-2">
            Xóa tất cả
          </button>
        </div>
      )}

      {/* Filter panel */}
      {showFilters && (
        <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="font-medium mb-3">Lọc nâng cao</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Trạng thái</h4>
              <div className="space-y-2">
                <button
                  onClick={() => addFilter("status", "active", "Đang hoạt động")}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                >
                  Đang hoạt động
                </button>
                <button
                  onClick={() => addFilter("status", "expired", "Đã hết hạn")}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                >
                  Đã hết hạn
                </button>
                <button
                  onClick={() => addFilter("status", "upcoming", "Sắp diễn ra")}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                >
                  Sắp diễn ra
                </button>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Loại giảm giá</h4>
              <div className="space-y-2">
                <button
                  onClick={() => addFilter("discount_type", "percentage", "Giảm theo %")}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                >
                  Giảm theo %
                </button>
                <button
                  onClick={() => addFilter("discount_type", "fixed", "Giảm số tiền cố định")}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                >
                  Giảm số tiền cố định
                </button>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Giá trị giảm giá</h4>
              <div className="space-y-2">
                <button
                  onClick={() => addFilter("discount_value", "low", "Thấp (< 10%)")}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                >
                  Thấp (&lt; 10%)
                </button>
                <button
                  onClick={() => addFilter("discount_value", "medium", "Trung bình (10-20%)")}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                >
                  Trung bình (10-20%)
                </button>
                <button
                  onClick={() => addFilter("discount_value", "high", "Cao (> 20%)")}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                >
                  Cao (&gt; 20%)
                </button>
              </div>
            </div>
          </div>

          {/* Sports Center filter */}
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Lọc theo trung tâm thể thao</h4>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="h-4 w-4 text-gray-400" />
                </div>
                <select
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={selectedCenter}
                  onChange={handleCenterChange}
                >
                  <option value="">-- Chọn trung tâm thể thao --</option>
                  {sportsCentersData.map((center) => (
                    <option key={center.centerId} value={center.centerId}>
                      {center.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={handleCenterFilter}
                disabled={!selectedCenter}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Thêm
              </button>
            </div>
          </div>

          {/* Court filter */}
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Lọc theo sân</h4>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-4 w-4 text-gray-400" />
                </div>
                <select
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={selectedCourt}
                  onChange={(e) => setSelectedCourt(e.target.value)}
                >
                  <option value="">-- Chọn sân --</option>
                  {filteredCourts.map((court) => (
                    <option key={court.courtId} value={court.courtId}>
                      {court.name} - {court.court_type}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={handleCourtFilter}
                disabled={!selectedCourt}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Thêm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PromotionSearch


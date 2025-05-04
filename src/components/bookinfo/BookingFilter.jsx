import React, { useState } from "react";
import { CalendarIcon, XMarkIcon } from "@heroicons/react/24/outline";

const BookingFilter = ({
  statusFilter,
  onStatusFilterChange,
  startDateFilter,
  endDateFilter,
  onStartDateFilterChange,
  onEndDateFilterChange,
  searchTerm,
  onSearchTermChange,
  onClearFilters,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Calculate minimum end date based on start date
  const getMinEndDate = () => {
    if (!startDateFilter) return "";

    const nextDay = new Date(startDateFilter);
    nextDay.setDate(nextDay.getDate() + 1);

    return nextDay.toISOString().split("T")[0];
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="flex-grow">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm theo tên học viên..."
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center transition-colors"
          >
            <svg
              className="mr-2 h-5 w-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Bộ lọc
          </button>
          {(statusFilter || startDateFilter || endDateFilter) && (
            <button
              onClick={onClearFilters}
              className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg flex items-center transition-colors"
            >
              <XMarkIcon className="h-5 w-5 mr-1" />
              Xóa lọc
            </button>
          )}
        </div>
      </div>

      {isFilterOpen && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trạng thái
            </label>
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="pending">Đang chờ xác nhận</option>
              <option value="completed">Đã hoàn thành</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Từ ngày
            </label>
            <div className="relative">
              <input
                type="date"
                value={startDateFilter}
                onChange={(e) => onStartDateFilterChange(e.target.value)}
                className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Đến ngày
            </label>
            <div className="relative">
              <input
                type="date"
                value={endDateFilter}
                onChange={(e) => onEndDateFilterChange(e.target.value)}
                min={getMinEndDate()}
                className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                disabled={!startDateFilter}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingFilter;

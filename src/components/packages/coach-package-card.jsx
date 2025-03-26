"use client"
import { motion } from "framer-motion"

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount)
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

const CoachPackageCard = ({ packageData, onEdit, onDelete }) => {
  // Determine coach name based on coach_id if not directly provided
  const getCoachName = () => {
    if (packageData.coach_name) return packageData.coach_name

    // Map coach_id to a default name if needed
    const coachIdMap = {
      "uuid-coach-001": "HLV Nguyễn Văn A",
      "uuid-coach-002": "HLV Trần Thị B",
      "uuid-coach-003": "HLV Lê Văn C",
    }

    return coachIdMap[packageData.coach_id] || "HLV"
  }

  // Determine category based on package name if not directly provided
  const getCategory = () => {
    if (packageData.category) return packageData.category

    // Extract category from package name
    if (packageData.package_name.includes("cơ bản")) return "Cơ bản"
    if (packageData.package_name.includes("nâng cao")) return "Nâng cao"
    if (packageData.package_name.includes("chuyên sâu")) return "Chuyên sâu"
    if (packageData.package_name.includes("giảm cân")) return "Giảm cân"
    if (packageData.package_name.includes("phục hồi")) return "Phục hồi"
    if (packageData.package_name.includes("cường độ cao")) return "Cường độ cao"

    return null
  }

  // Determine duration based on session count if not directly provided
  const getDuration = () => {
    if (packageData.duration) return packageData.duration

    // Default duration based on session count
    return `${60} phút/buổi`
  }

  const category = getCategory()
  const coachName = getCoachName()
  const duration = getDuration()

  return (
    <motion.div
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <img
          src={packageData.image || "/placeholder.svg?height=200&width=300"}
          alt={packageData.package_name}
          className="w-full h-48 object-cover"
        />
        {category && (
          <div className="absolute top-0 right-0 bg-emerald-600 text-white px-3 py-1 m-2 rounded-full text-sm font-medium">
            {category}
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-slate-800 mb-1">{packageData.package_name}</h3>
          <div className="flex space-x-1">
            <button
              onClick={() => onEdit(packageData)}
              className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded-full hover:bg-blue-50"
              title="Chỉnh sửa"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              onClick={() => onDelete(packageData.id)}
              className="text-rose-600 hover:text-rose-800 transition-colors p-1 rounded-full hover:bg-rose-50"
              title="Xóa"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="text-sm text-slate-600 mb-3 font-medium">{coachName}</div>

        <div className="mb-4">
          <p className="text-slate-700 line-clamp-2">{packageData.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
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
            <span className="text-slate-700 font-medium">{packageData.session_count} buổi</span>
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
            <span className="text-slate-700 font-medium">{duration}</span>
          </div>
        </div>

        <div className="text-sm text-slate-500 mb-4">Ngày tạo: {formatDate(packageData.created_at)}</div>

        <div className="mt-4">
          <div className="text-2xl font-bold text-emerald-600">{formatCurrency(packageData.price)}</div>
        </div>
      </div>
    </motion.div>
  )
}

export default CoachPackageCard


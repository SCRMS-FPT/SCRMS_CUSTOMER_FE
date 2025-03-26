"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import CoachPackagesGrid from "../components/packages/coach-packages-grid"
import Pagination from "../components/packages/pagination"
import PackageFormModal from "../components/packages/package-form-modal"
import ConfirmDeleteModal from "../components/packages/confirm-delete-modal"
import { coachPackages as initialPackages } from "../data/coachPackageData"
import { useParams } from "react-router-dom"; // Import useParams


// Utility functions
const generateId = () => {
  return `uuid-package-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

const CoachPackagesPage = () => {
  const { coach_id } = useParams(); // Lấy coach_id từ URL

  // State for packages data
  const [packages, setPackages] = useState(initialPackages);
  const [filteredPackages, setFilteredPackages] = useState([]);

  useEffect(() => {
    if (coach_id) {
      // Lọc các gói đào tạo theo coach_id
      const coachPackages = initialPackages.filter((pkg) => pkg.coach_id === coach_id);
      setPackages(coachPackages);
      setFilteredPackages(coachPackages);
    } else {
      // Hiển thị tất cả các gói đào tạo
      setPackages(initialPackages);
      setFilteredPackages(initialPackages);
    }
  }, [coach_id]);

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("package_name")
  const [categoryFilter, setCategoryFilter] = useState("")

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(6)
  const [paginatedPackages, setPaginatedPackages] = useState([])

  // State for modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [currentPackage, setCurrentPackage] = useState(null)
  const [packageToDelete, setPackageToDelete] = useState(null)

  // Get unique categories for filter - handle case where category might not exist
  const categories = [...new Set(packages.map((pkg) => pkg.category).filter(Boolean))]

  // Apply filters and sorting
  useEffect(() => {
    let result = [...packages]

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (pkg) =>
          pkg.package_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pkg.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (pkg.coach_name && pkg.coach_name.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Apply category filter - only if category exists
    if (categoryFilter) {
      result = result.filter((pkg) => pkg.category === categoryFilter)
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === "price_low") {
        return a.price - b.price
      } else if (sortBy === "price_high") {
        return b.price - a.price
      } else if (sortBy === "session_count") {
        return b.session_count - a.session_count
      } else if (sortBy === "newest") {
        return new Date(b.created_at) - new Date(a.created_at)
      } else {
        // Default sort by name
        return a.package_name.localeCompare(b.package_name)
      }
    })

    setFilteredPackages(result)
    setCurrentPage(1) // Reset to first page when filters change
  }, [packages, searchTerm, sortBy, categoryFilter])

  // Apply pagination
  useEffect(() => {
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    setPaginatedPackages(filteredPackages.slice(startIndex, endIndex))
  }, [filteredPackages, currentPage, pageSize])

  // Calculate total pages
  const totalPages = Math.ceil(filteredPackages.length / pageSize)

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  // Handle page size change
  const handlePageSizeChange = (size) => {
    setPageSize(size)
    setCurrentPage(1) // Reset to first page when page size changes
  }

  // CRUD Operations
  const handleAddPackage = () => {
    setCurrentPackage(null)
    setIsFormModalOpen(true)
  }

  const handleEditPackage = (packageData) => {
    setCurrentPackage(packageData)
    setIsFormModalOpen(true)
  }

  const handleDeletePackage = (packageId) => {
    const packageToDelete = packages.find((pkg) => pkg.id === packageId)
    setPackageToDelete(packageToDelete)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    if (packageToDelete) {
      setPackages(packages.filter((pkg) => pkg.id !== packageToDelete.id))
      setIsDeleteModalOpen(false)
      setPackageToDelete(null)
    }
  }

  const handleFormSubmit = (formData) => {
    if (currentPackage) {
      // Update existing package
      setPackages(packages.map((pkg) => (pkg.id === formData.id ? formData : pkg)))
    } else {
      // Add new package with generated ID if not provided
      const newPackage = {
        ...formData,
        id: formData.id || generateId(),
        created_at: formData.created_at || new Date().toISOString(),
      }
      setPackages([...packages, newPackage])
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3 },
    },
  }

  return (
    <div className="min-h-screen bg-slate-50 w-full">
      {/* Hero Background Image Section */}
      <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/placeholder.svg?height=800&width=1600')",
            backgroundPosition: "center 30%",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/80 to-emerald-700/70"></div>
        </div>
        <div className="relative h-full flex flex-col justify-center items-center text-center px-4 z-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Gói Đào Tạo Chuyên Nghiệp
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-100 max-w-2xl"
          >
            Nâng cao kỹ năng và thể lực của bạn với các gói đào tạo được thiết kế riêng
          </motion.p>
        </div>
      </div>

      <div className="w-full px-4 py-8 max-w-[2000px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-md p-6 mb-8 -mt-16 relative z-20"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">Gói Đào Tạo</h1>
              <p className="text-slate-600">Lựa chọn gói đào tạo phù hợp với mục tiêu của bạn</p>
            </div>
            <button
              onClick={handleAddPackage}
              className="mt-4 md:mt-0 flex items-center bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Thêm gói đào tạo
            </button>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <motion.div variants={itemVariants} className="col-span-1 md:col-span-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm gói đào tạo..."
                  className="w-full px-4 py-3 pl-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
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
            </motion.div>

            {categories.length > 0 && (
              <motion.div variants={itemVariants} className="col-span-1 md:col-span-1">
                <select
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="">Tất cả danh mục</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </motion.div>
            )}

            <motion.div variants={itemVariants} className="col-span-1 md:col-span-1">
              <select
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="package_name">Sắp xếp theo tên</option>
                <option value="price_low">Giá: Thấp đến cao</option>
                <option value="price_high">Giá: Cao đến thấp</option>
                <option value="session_count">Số buổi tập</option>
                <option value="newest">Mới nhất</option>
              </select>
            </motion.div>
          </motion.div>
        </motion.div>

        <div className="mb-4">
          <div className="text-sm text-slate-600">Hiển thị {filteredPackages.length} kết quả</div>
        </div>

        <CoachPackagesGrid packages={paginatedPackages} onEdit={handleEditPackage} onDelete={handleDeletePackage} />

        {filteredPackages.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            pageSize={pageSize}
            onPageSizeChange={handlePageSizeChange}
            totalItems={filteredPackages.length}
          />
        )}
      </div>

      {/* Modals */}
      <PackageFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={currentPackage}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        packageName={packageToDelete?.package_name || ""}
      />
    </div>
  )
}

export default CoachPackagesPage


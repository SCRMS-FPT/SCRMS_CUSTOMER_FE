"use client";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Client } from "../../API/CoachApi";
import { motion } from "framer-motion";
import {
  Tag,
  Percent,
  Calendar,
  BarChart3,
  RefreshCw,
  User,
  Package,
  PlusCircle,
} from "lucide-react";
import { notification, Modal, Spin, Tooltip } from "antd";
import { Card, CardContent } from "@mui/material";
import CoachPromotionSearch from "../../components/promation/CoachPromotionSearch";
import CoachPromotionTable from "../../components/promation/CoachPromotionTable";
import CoachPromotionForm from "../../components/promation/CoachPromotionForm";
import { Icon } from "@iconify/react";

const CoachPromotionManagementPage = () => {
  const { coachId, packageId } = useParams();
  const [promotions, setPromotions] = useState([]);
  const [filteredPromotions, setFilteredPromotions] = useState([]);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [packages, setPackages] = useState([]);
  const [api, contextHolder] = notification.useNotification();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [paginatedPromotions, setPaginatedPromotions] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  // Initialize API client
  const client = new Client();

  useEffect(() => {
    fetchPromotions();
    fetchCoachPackages();
  }, [coachId, packageId]);

  const fetchPromotions = async () => {
    setIsLoading(true);
    try {
      const response = await client.getMyPromotions(currentPage, itemsPerPage);
      setPromotions(response || []);

      let filtered = response || [];
      if (packageId) {
        filtered = filtered.filter((promo) => promo.packageId === packageId);
      }

      setFilteredPromotions(filtered);
    } catch (error) {
      console.error("Error fetching promotions:", error);
      api.error({
        message: "Lỗi",
        description: "Không thể tải dữ liệu khuyến mãi. Vui lòng thử lại sau.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCoachPackages = async () => {
    try {
      const response = await client.getCoachPackages();
      setPackages(response || []);
    } catch (error) {
      console.error("Error fetching coach packages:", error);
      api.error({
        message: "Lỗi",
        description: "Không thể tải dữ liệu gói huấn luyện.",
      });
    }
  };

  useEffect(() => {
    // Calculate total pages
    const total = Math.ceil(filteredPromotions.length / itemsPerPage);
    setTotalPages(total || 1);

    // Adjust current page if needed
    if (currentPage > total && total > 0) {
      setCurrentPage(total);
    }

    // Get paginated data
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredPromotions.slice(
      startIndex,
      startIndex + itemsPerPage
    );
    setPaginatedPromotions(paginatedData);
  }, [filteredPromotions, currentPage, itemsPerPage]);

  const handleSearch = (searchTerm, searchType) => {
    if (!searchTerm.trim()) {
      setFilteredPromotions(promotions);
      return;
    }

    const filtered = promotions.filter((promotion) => {
      if (searchType === "all") {
        return Object.values(promotion).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );
      } else if (searchType === "packageId") {
        const pkg = packages.find((p) => p.id === promotion.packageId);
        return pkg && pkg.name.toLowerCase().includes(searchTerm.toLowerCase());
      } else {
        return String(promotion[searchType])
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      }
    });

    setFilteredPromotions(filtered);
    setCurrentPage(1);
  };

  const handleFilter = (filters) => {
    if (!filters || filters.length === 0) {
      setFilteredPromotions(promotions);
      return;
    }

    const filtered = promotions.filter((promotion) => {
      return filters.every((filter) => {
        if (filter.type === "status") {
          const now = new Date();
          const startDate = new Date(promotion.validFrom);
          const endDate = new Date(promotion.validTo);

          if (filter.value === "active") {
            return now >= startDate && now <= endDate;
          } else if (filter.value === "expired") {
            return now > endDate;
          } else if (filter.value === "upcoming") {
            return now < startDate;
          }
        }

        if (filter.type === "discountType") {
          return promotion.discountType === filter.value;
        }

        if (filter.type === "packageId") {
          return promotion.packageId === filter.value;
        }

        if (filter.type === "promotion_type") {
          if (filter.value === "package") {
            return promotion.packageId !== undefined;
          } else if (filter.value === "schedule") {
            return promotion.scheduleId !== undefined;
          }
        }

        return true;
      });
    });

    setFilteredPromotions(filtered);
    setCurrentPage(1);
  };

  const handleEdit = (promotion) => {
    setSelectedPromotion(promotion);
    setShowForm(true);
  };

  const handleDelete = (promotionId) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa khuyến mãi này?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await client.deletePromotion(promotionId);

          // Update UI after successful deletion
          const updatedPromotions = promotions.filter(
            (p) => p.id !== promotionId
          );
          setPromotions(updatedPromotions);
          setFilteredPromotions(updatedPromotions);

          api.success({
            message: "Thành công",
            description: "Đã xóa khuyến mãi thành công",
          });
        } catch (error) {
          console.error("Error deleting promotion:", error);
          api.error({
            message: "Lỗi",
            description: "Không thể xóa khuyến mãi.",
          });
        }
      },
    });
  };

  const handleSave = async (formData) => {
    try {
      if (selectedPromotion) {
        // Update existing promotion
        await client.updateCoachPromotion(selectedPromotion.id, {
          packageId: formData.packageId,
          scheduleId: formData.scheduleId,
          description: formData.description,
          discountType: formData.discountType,
          discountValue: formData.discountValue,
          validFrom: formData.validFrom,
          validTo: formData.validTo,
        });

        api.success({
          message: "Thành công",
          description: "Đã cập nhật khuyến mãi thành công",
        });
      } else {
        // Create new promotion
        const result = await client.createMyPromotion({
          packageId: formData.packageId,
          scheduleId: formData.scheduleId,
          description: formData.description,
          discountType: formData.discountType,
          discountValue: formData.discountValue,
          validFrom: formData.validFrom,
          validTo: formData.validTo,
        });

        api.success({
          message: "Thành công",
          description: "Đã tạo khuyến mãi mới thành công",
        });
      }

      // Refresh data
      fetchPromotions();
    } catch (error) {
      console.error("Error saving promotion:", error);
      api.error({
        message: "Lỗi",
        description: "Không thể lưu khuyến mãi. Vui lòng thử lại sau.",
      });
    } finally {
      setShowForm(false);
      setSelectedPromotion(null);
    }
  };

  const handleRefresh = () => {
    fetchPromotions();
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedPromotion(null);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // Calculate stats
  const getStats = () => {
    const now = new Date();

    const active = promotions.filter((p) => {
      const startDate = new Date(p.validFrom);
      const endDate = new Date(p.validTo);
      return now >= startDate && now <= endDate;
    }).length;

    const expired = promotions.filter((p) => {
      const endDate = new Date(p.validTo);
      return now > endDate;
    }).length;

    const upcoming = promotions.filter((p) => {
      const startDate = new Date(p.validFrom);
      return now < startDate;
    }).length;

    const packagePromotions = promotions.filter((p) => p.packageId).length;
    const schedulePromotions = promotions.filter((p) => p.scheduleId).length;

    return {
      active,
      expired,
      upcoming,
      total: promotions.length,
      packagePromotions,
      schedulePromotions,
    };
  };

  const getPaginationInfo = () => {
    const totalItems = filteredPromotions.length;
    const startItem =
      totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(startItem + itemsPerPage - 1, totalItems);

    return {
      currentPage,
      totalPages,
      itemsPerPage,
      totalItems,
      startItem,
      endItem,
    };
  };

  const stats = getStats();
  const paginationInfo = getPaginationInfo();

  return (
    <div className="w-full px-4 py-6">
      {contextHolder}

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Quản Lý Khuyến Mãi
          </h1>
          <p className="text-gray-500 mt-1">
            Tạo và quản lý các chương trình giảm giá cho học viên
          </p>
        </div>

        <div className="flex gap-2">
          <Tooltip title="Làm mới dữ liệu">
            <button
              onClick={handleRefresh}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300 flex items-center gap-1"
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">Làm mới</span>
            </button>
          </Tooltip>

          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow hover:shadow-md transition-all duration-300 flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Thêm khuyến mãi</span>
          </button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4 mb-6">
        <motion.div
          whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
          className="bg-white p-4 rounded-lg shadow-sm flex items-center border border-transparent hover:border-blue-300 transition-all duration-300"
        >
          <div className="rounded-full bg-blue-50 p-3 mr-4">
            <Tag className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Tổng khuyến mãi</p>
            <p className="text-2xl font-semibold">{stats.total}</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
          className="bg-white p-4 rounded-lg shadow-sm flex items-center border border-transparent hover:border-green-300 transition-all duration-300"
        >
          <div className="rounded-full bg-green-50 p-3 mr-4">
            <Percent className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Đang hoạt động</p>
            <p className="text-2xl font-semibold">{stats.active}</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
          className="bg-white p-4 rounded-lg shadow-sm flex items-center border border-transparent hover:border-yellow-300 transition-all duration-300"
        >
          <div className="rounded-full bg-yellow-50 p-3 mr-4">
            <Calendar className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Sắp diễn ra</p>
            <p className="text-2xl font-semibold">{stats.upcoming}</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
          className="bg-white p-4 rounded-lg shadow-sm flex items-center border border-transparent hover:border-red-300 transition-all duration-300"
        >
          <div className="rounded-full bg-red-50 p-3 mr-4">
            <BarChart3 className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Đã hết hạn</p>
            <p className="text-2xl font-semibold">{stats.expired}</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
          className="bg-white p-4 rounded-lg shadow-sm flex items-center border border-transparent hover:border-purple-300 transition-all duration-300"
        >
          <div className="rounded-full bg-purple-50 p-3 mr-4">
            <Package className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">KM gói tập</p>
            <p className="text-2xl font-semibold">{stats.packagePromotions}</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
          className="bg-white p-4 rounded-lg shadow-sm flex items-center border border-transparent hover:border-pink-300 transition-all duration-300"
        >
          <div className="rounded-full bg-pink-50 p-3 mr-4">
            <Icon icon="mdi:calendar-clock" className="h-6 w-6 text-pink-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">KM lịch tập</p>
            <p className="text-2xl font-semibold">{stats.schedulePromotions}</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
          className="bg-white p-4 rounded-lg shadow-sm flex items-center border border-transparent hover:border-indigo-300 transition-all duration-300"
        >
          <div className="rounded-full bg-indigo-50 p-3 mr-4">
            <User className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Tỷ lệ chuyển đổi</p>
            <p className="text-2xl font-semibold">
              {stats.total ? Math.round((stats.active / stats.total) * 100) : 0}
              %
            </p>
          </div>
        </motion.div>
      </div>

      {showForm ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6 mb-6"
        >
          <CoachPromotionForm
            promotion={selectedPromotion}
            onSave={handleSave}
            onCancel={handleCancel}
            coachPackages={packages}
          />
        </motion.div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <CoachPromotionSearch
              onSearch={handleSearch}
              onFilter={handleFilter}
              coachPackages={packages}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6"
          >
            {isLoading ? (
              <Card className="p-8 flex justify-center items-center min-h-[200px]">
                <Spin size="large" tip="Đang tải dữ liệu..." />
              </Card>
            ) : (
              <CoachPromotionTable
                promotions={paginatedPromotions}
                onEdit={handleEdit}
                onDelete={handleDelete}
                pagination={paginationInfo}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
                coachPackages={packages}
              />
            )}
          </motion.div>
        </>
      )}
    </div>
  );
};

export default CoachPromotionManagementPage;

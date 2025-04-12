import React, { useState, useEffect } from "react";
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
  User,
  Package,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";
import { Client as CoachClient } from "../../API/CoachApi";
import { Client as IdentityClient } from "../../API/IdentityApi";
import { Tooltip, Skeleton, Empty } from "antd";
import moment from "moment";

const CoachPromotionTable = ({
  promotions,
  onEdit,
  onDelete,
  pagination,
  onPageChange,
  onItemsPerPageChange,
  coachPackages,
}) => {
  const [coachesData, setCoachesData] = useState({});
  const [usersData, setUsersData] = useState({});
  const [schedulesData, setSchedulesData] = useState({});
  const [loadingCoaches, setLoadingCoaches] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingSchedules, setLoadingSchedules] = useState(false);
  const [error, setError] = useState(null);

  const {
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    startItem,
    endItem,
  } = pagination || {
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10,
    totalItems: 0,
    startItem: 0,
    endItem: 0,
  };

  const coachClient = new CoachClient();
  const identityClient = new IdentityClient();

  // Helper to get a unique set of coach IDs from promotions
  const getUniqueCoachIds = () => {
    return [...new Set(promotions.map((promo) => promo.coachId))].filter(
      Boolean
    );
  };

  // Get unique schedule IDs from promotions
  const getUniqueScheduleIds = () => {
    return [
      ...new Set(
        promotions.filter((p) => p.scheduleId).map((p) => p.scheduleId)
      ),
    ].filter(Boolean);
  };

  // Fetch coach data for each unique coach in the promotions
  useEffect(() => {
    const fetchCoachData = async () => {
      const coachIds = getUniqueCoachIds();
      if (!coachIds.length) return;

      setLoadingCoaches(true);
      try {
        const coachesDataMap = {};

        // Fetch coaches in parallel
        await Promise.all(
          coachIds.map(async (coachId) => {
            try {
              const coachData = await coachClient.getCoachById(coachId);
              coachesDataMap[coachId] = coachData;

              // Also fetch corresponding user profile for name
              try {
                const userData = await identityClient.profile(coachId);
                setUsersData((prev) => ({ ...prev, [coachId]: userData }));
              } catch (userError) {
                console.error(
                  `Error fetching user data for ${coachId}:`,
                  userError
                );
              }
            } catch (err) {
              console.error(`Error fetching coach data for ${coachId}:`, err);
            }
          })
        );

        setCoachesData(coachesDataMap);
      } catch (err) {
        console.error("Error fetching coach data:", err);
        setError("Failed to load coach information");
      } finally {
        setLoadingCoaches(false);
      }
    };

    if (promotions?.length > 0) {
      fetchCoachData();
    }
  }, [promotions]);

  // Format date to locale string
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return moment(dateString).format("DD/MM/YYYY");
  };

  // Format discount values based on discount type
  const formatDiscountValue = (type, value) => {
    if (!type || value === undefined || value === null) return "N/A";

    if (type === "percentage") {
      return `${value}%`;
    } else {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(value);
    }
  };

  // Determine promotion status based on valid dates
  const getPromotionStatus = (validFrom, validTo) => {
    const now = new Date();
    const startDate = new Date(validFrom);
    const endDate = new Date(validTo);

    if (now < startDate) {
      return {
        status: "upcoming",
        label: "Sắp diễn ra",
        icon: <Clock className="h-4 w-4 text-yellow-500" />,
        color: "bg-yellow-100 text-yellow-800",
      };
    } else if (now > endDate) {
      return {
        status: "expired",
        label: "Đã hết hạn",
        icon: <AlertCircle className="h-4 w-4 text-red-500" />,
        color: "bg-red-100 text-red-800",
      };
    } else {
      return {
        status: "active",
        label: "Đang hoạt động",
        icon: <CheckCircle className="h-4 w-4 text-green-500" />,
        color: "bg-green-100 text-green-800",
      };
    }
  };

  // Updated function to get coach info using API data
  const getCoachInfo = (coachId) => {
    if (!coachId)
      return {
        bio: "Không có thông tin",
        ratePerHour: 0,
        fullName: "Không xác định",
      };

    const coachData = coachesData[coachId];
    const userData = usersData[coachId];

    if (!coachData) {
      return { bio: "Đang tải...", ratePerHour: 0, fullName: "Đang tải..." };
    }

    // Get full name from user data if available, otherwise from coach data
    const fullName = userData
      ? `${userData.lastName} ${userData.firstName}`
      : coachData.fullName || `HLV ${coachId.substring(0, 8)}...`;

    // Get a shortened bio
    const bio = coachData.bio
      ? coachData.bio.split(".")[0] + "."
      : "Không có mô tả";

    return {
      bio,
      ratePerHour: coachData.ratePerHour || 0,
      fullName,
    };
  };

  // Get package info from packages prop
  const getPackageInfo = (packageId) => {
    if (!packageId) return "Không có thông tin";

    // Check if coachPackages is available
    if (!coachPackages || !Array.isArray(coachPackages)) {
      return "Đang tải...";
    }

    const pkg = coachPackages.find((p) => p.id === packageId);
    return pkg ? pkg.name : "Gói không tồn tại";
  };

  // Get promotion type (package or schedule)
  const getPromotionType = (promotion) => {
    if (promotion.packageId) {
      return {
        type: "package",
        label: "Gói tập",
        icon: <Package className="h-4 w-4 text-purple-500" />,
        color: "bg-purple-100 text-purple-800",
        value: getPackageInfo(promotion.packageId),
      };
    } else if (promotion.scheduleId) {
      return {
        type: "schedule",
        label: "Lịch tập",
        icon: <Calendar className="h-4 w-4 text-pink-500" />,
        color: "bg-pink-100 text-pink-800",
        value: "Khung giờ huấn luyện",
      };
    }

    return {
      type: "unknown",
      label: "Không xác định",
      icon: <AlertCircle className="h-4 w-4 text-gray-500" />,
      color: "bg-gray-100 text-gray-800",
      value: "",
    };
  };

  // Generate pagination numbers array
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages is less than or equal to maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Calculate pages to display
      let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
      let endPage = startPage + maxPagesToShow - 1;

      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis if necessary
      if (startPage > 1) {
        pageNumbers.unshift("...");
        pageNumbers.unshift(1);
      }

      if (endPage < totalPages) {
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  // Loading state for the coach info cell
  const CoachInfoSkeleton = () => (
    <div className="flex flex-col">
      <Skeleton.Avatar active size="small" shape="circle" />
      <Skeleton active paragraph={{ rows: 1 }} title={{ width: "60%" }} />
    </div>
  );

  // Render loading state for the row
  const LoadingRows = () => (
    <tr>
      <td colSpan="9" className="px-6 py-10 text-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-2"></div>
          <p className="text-gray-500">Đang tải dữ liệu...</p>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã KM
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Huấn luyện viên
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Loại khuyến mãi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Áp dụng cho
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mô tả
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
            {error ? (
              <tr>
                <td colSpan="9" className="px-6 py-10 text-center text-red-500">
                  <div className="flex flex-col items-center">
                    <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
                    <p>{error}</p>
                  </div>
                </td>
              </tr>
            ) : loadingCoaches || loadingUsers ? (
              <LoadingRows />
            ) : promotions && promotions.length > 0 ? (
              promotions.map((promotion) => {
                const status = getPromotionStatus(
                  promotion.validFrom,
                  promotion.validTo
                );
                const coachInfo = getCoachInfo(promotion.coachId);
                const promotionType = getPromotionType(promotion);

                return (
                  <tr
                    key={promotion.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Tag className="h-4 w-4 text-blue-500 mr-2" />
                        <span className="text-sm font-medium text-gray-900">
                          {promotion.id.substring(0, 8)}...
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {loadingCoaches ? (
                        <CoachInfoSkeleton />
                      ) : (
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <User className="h-4 w-4 text-indigo-500 mr-2" />
                            <span className="text-sm font-medium text-gray-900">
                              {coachInfo.fullName}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                            {coachInfo.bio}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(coachInfo.ratePerHour)}
                            /giờ
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${promotionType.color}`}
                      >
                        {promotionType.icon}
                        <span className="ml-1">{promotionType.label}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {promotionType.value}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className="text-sm text-gray-900 max-w-xs truncate"
                        title={promotion.description}
                      >
                        {promotion.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        {promotion.discountType === "percentage" ? (
                          <>
                            <Percent className="h-4 w-4 text-purple-500 mr-2" />
                            <span className="font-medium">
                              {formatDiscountValue(
                                promotion.discountType,
                                promotion.discountValue
                              )}
                            </span>
                          </>
                        ) : (
                          <>
                            <DollarSign className="h-4 w-4 text-green-500 mr-2" />
                            <span className="font-medium">
                              {formatDiscountValue(
                                promotion.discountType,
                                promotion.discountValue
                              )}
                            </span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                          <span>Từ: {formatDate(promotion.validFrom)}</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                          <span>Đến: {formatDate(promotion.validTo)}</span>
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
                        <Tooltip title="Chỉnh sửa">
                          <button
                            onClick={() => onEdit(promotion)}
                            className="text-blue-600 hover:text-blue-900 transition-colors flex items-center p-1 rounded-full hover:bg-blue-50"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        </Tooltip>

                        <Tooltip title="Xóa">
                          <button
                            onClick={() => onDelete(promotion.id)}
                            className="text-red-600 hover:text-red-900 transition-colors flex items-center p-1 rounded-full hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </Tooltip>

                        <Tooltip title="Xem chi tiết">
                          <button className="text-gray-600 hover:text-gray-900 transition-colors flex items-center p-1 rounded-full hover:bg-gray-50">
                            <ArrowUpRight className="h-4 w-4" />
                          </button>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="9" className="px-6 py-10 text-center">
                  <Empty
                    description="Không tìm thấy khuyến mãi nào"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
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
                className="mx-2 px-2 py-1 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
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
                {totalItems > 0
                  ? `${startItem}-${endItem} / ${totalItems} mục`
                  : "0 mục"}
              </span>
            </div>

            <div className="flex items-center justify-center">
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={() => onPageChange(1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium transition-colors ${
                    currentPage === 1
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <span className="sr-only">Trang đầu</span>
                  <ChevronsLeft className="h-5 w-5" />
                </button>

                <button
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium transition-colors ${
                    currentPage === 1
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-500 hover:bg-gray-50"
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
                    );
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => onPageChange(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors ${
                        currentPage === pageNum
                          ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium transition-colors ${
                    currentPage === totalPages
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <span className="sr-only">Trang sau</span>
                  <ChevronRight className="h-5 w-5" />
                </button>

                <button
                  onClick={() => onPageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium transition-colors ${
                    currentPage === totalPages
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-500 hover:bg-gray-50"
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
  );
};

export default CoachPromotionTable;

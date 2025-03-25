"use client";

import { useState, useMemo, useEffect } from "react";
import { coachBookings } from "../data/coachBookings";
import { courtBookings } from "../data/courtBookings";
import { purchases } from "../data/purchases";
import TransactionList from "../components/TransactionList";
import TransactionFilter from "../components/TransactionFilter";
import TransactionSearch from "../components/TransactionSearch";
import TransactionEmpty from "../components/TransactionEmpty";
import Pagination from "../components/GeneralComponents/Pagination";
import { History, SlidersHorizontal, RefreshCw } from "lucide-react";

// CSS cho animation và layout
const styles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-in-out;
  }
  
  body, html {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  }

  body {
    background-color: #f9fafb;
    width: 100vw;
    overflow-x: hidden;
  }
  
  #root, main {
    min-height: 100vh;
    width: 100vw;
    overflow-x: hidden;
  }
`;

/**
 * Filter transactions based on search query
 * @param {Array} transactions - Array of transactions
 * @param {string} query - Search query
 * @returns {Array} Filtered transactions
 */
const filterTransactions = (transactions, query) => {
  if (!query) return transactions;

  const lowerCaseQuery = query.toLowerCase();

  return transactions.filter((transaction) => {
    // Kiểm tra các trường khác nhau tùy thuộc vào loại giao dịch
    const searchableFields = Object.values(transaction).map((value) =>
      value ? String(value).toLowerCase() : ""
    );

    return searchableFields.some((field) => field.includes(lowerCaseQuery));
  });
};

// Hàm định dạng ngày tháng
const formatDate = (dateString) => {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("vi-VN", options);
};

const TransactionHistoryPage = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  // Thêm CSS vào trang
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.innerHTML = styles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Lọc dữ liệu dựa trên tìm kiếm
  const filteredCoachBookings = useMemo(
    () => filterTransactions(coachBookings, searchQuery),
    [searchQuery]
  );
  const filteredCourtBookings = useMemo(
    () => filterTransactions(courtBookings, searchQuery),
    [searchQuery]
  );
  const filteredPurchases = useMemo(
    () => filterTransactions(purchases, searchQuery),
    [searchQuery]
  );

  // Tính tổng số lượng cho mỗi loại giao dịch
  const totalCounts = {
    coach: filteredCoachBookings.length,
    court: filteredCourtBookings.length,
    package: filteredPurchases.length,
    all:
      filteredCoachBookings.length +
      filteredCourtBookings.length +
      filteredPurchases.length,
  };

  // Lấy danh sách giao dịch dựa trên bộ lọc đang hoạt động
  const getFilteredTransactions = () => {
    let transactions = [];

    switch (activeFilter) {
      case "all":
        transactions = [
          ...filteredCoachBookings.map((item) => ({ ...item, type: "coach" })),
          ...filteredCourtBookings.map((item) => ({ ...item, type: "court" })),
          ...filteredPurchases.map((item) => ({ ...item, type: "package" })),
        ];
        break;
      case "coach":
        transactions = filteredCoachBookings.map((item) => ({
          ...item,
          type: "coach",
        }));
        break;
      case "court":
        transactions = filteredCourtBookings.map((item) => ({
          ...item,
          type: "court",
        }));
        break;
      case "package":
        transactions = filteredPurchases.map((item) => ({
          ...item,
          type: "package",
        }));
        break;
      default:
        transactions = [];
    }

    // Sắp xếp theo ngày (lấy ngày từ các trường khác nhau tùy loại giao dịch)
    return transactions.sort((a, b) => {
      const dateA = a.date || a.purchase_date;
      const dateB = b.date || b.purchase_date;
      return new Date(dateB) - new Date(dateA); // Sắp xếp giảm dần (mới nhất trước)
    });
  };

  const allFilteredTransactions = useMemo(
    () => getFilteredTransactions(),
    [
      activeFilter,
      filteredCoachBookings,
      filteredCourtBookings,
      filteredPurchases,
    ]
  );

  // Tính toán tổng số trang
  const totalPages = Math.ceil(allFilteredTransactions.length / itemsPerPage);

  // Lấy các giao dịch cho trang hiện tại
  const currentTransactions = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return allFilteredTransactions.slice(indexOfFirstItem, indexOfLastItem);
  }, [allFilteredTransactions, currentPage, itemsPerPage]);

  // Reset trang khi thay đổi bộ lọc hoặc tìm kiếm
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, searchQuery]);

  // Xử lý thay đổi trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Cuộn lên đầu danh sách
    window.scrollTo({
      top: document.getElementById("transaction-list").offsetTop - 20,
      behavior: "smooth",
    });
  };

  // Xử lý thay đổi số lượng mục trên mỗi trang
  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset về trang đầu tiên
  };

  // Xử lý đặt lại bộ lọc
  const handleResetFilters = () => {
    setSearchQuery("");
    setActiveFilter("all");
    setCurrentPage(1);
  };

  // Hiển thị danh sách giao dịch
  const renderTransactions = () => {
    // Nếu không có kết quả tìm kiếm
    if (allFilteredTransactions.length === 0) {
      return (
        <TransactionEmpty
          message="Không tìm thấy giao dịch nào phù hợp với tìm kiếm của bạn"
          isSearchResult={true}
          onReset={handleResetFilters}
        />
      );
    }

    // Nhóm các giao dịch theo ngày
    const transactionsByDate = currentTransactions.reduce(
      (acc, transaction) => {
        // Lấy ngày từ các trường khác nhau tùy loại giao dịch
        const dateString = transaction.date || transaction.purchase_date;
        const dateKey = dateString; // Sử dụng chuỗi ngày làm key

        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(transaction);
        return acc;
      },
      {}
    );

    // Sắp xếp các ngày theo thứ tự giảm dần (mới nhất trước)
    const sortedDates = Object.keys(transactionsByDate).sort(
      (a, b) => new Date(b) - new Date(a)
    );

    // Hiển thị các giao dịch theo nhóm ngày
    return (
      <>
        {sortedDates.map((dateKey) => (
          <div key={dateKey} className="mb-8">
            <div className="flex items-center mb-4">
              <div className="h-px flex-grow bg-gray-200"></div>
              <h2 className="px-4 text-lg font-medium text-gray-700">
                {formatDate(dateKey)}
              </h2>
              <div className="h-px flex-grow bg-gray-200"></div>
            </div>

            {/* Nhóm các giao dịch theo loại trong mỗi ngày */}
            {(() => {
              const transactionsForDate = transactionsByDate[dateKey];
              const groupedByType = transactionsForDate.reduce(
                (acc, transaction) => {
                  if (!acc[transaction.type]) {
                    acc[transaction.type] = [];
                  }
                  acc[transaction.type].push(transaction);
                  return acc;
                },
                {}
              );

              return Object.entries(groupedByType).map(
                ([type, transactions]) => {
                  const titles = {
                    coach: "Đặt lịch HLV",
                    court: "Đặt sân",
                    package: "Gói tập",
                  };

                  return (
                    <TransactionList
                      key={`${dateKey}-${type}`}
                      transactions={transactions}
                      type={type}
                      title={titles[type]}
                    />
                  );
                }
              );
            })()}
          </div>
        ))}
      </>
    );
  };

  return (
    <div className="min-h-screen w-screen overflow-x-hidden">
      <div className="w-full px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold flex items-center text-gray-800">
            <History className="w-8 h-8 mr-2 text-blue-600" />
            Lịch Sử Giao Dịch
          </h1>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center px-4 py-2 text-sm bg-white hover:bg-gray-100 rounded-full transition-colors shadow-md"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            {isFilterOpen ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
          </button>
        </div>

        {isFilterOpen && (
          <div className="mb-6 space-y-4 bg-white p-6 rounded-xl border border-gray-200 shadow-lg animate-fadeIn">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-700">
                Tìm kiếm & Lọc
              </h2>
              <button
                onClick={handleResetFilters}
                className="flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Đặt lại
              </button>
            </div>

            <TransactionSearch
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
            <TransactionFilter
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              totalCounts={totalCounts}
            />
          </div>
        )}

        <div
          id="transaction-list"
          className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300"
        >
          {renderTransactions()}

          {allFilteredTransactions.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              totalItems={allFilteredTransactions.length}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionHistoryPage;

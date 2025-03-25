import React from "react";
import { Pagination } from "antd";

const PaginationControls = ({ total, pageSize, currentPage, setCurrentPage }) => {
  return (
    <div className="flex justify-center mt-4">
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={total}
        onChange={setCurrentPage}
        showSizeChanger={false}
        className="text-gray-600"
      />
    </div>
  );
};

export default PaginationControls;
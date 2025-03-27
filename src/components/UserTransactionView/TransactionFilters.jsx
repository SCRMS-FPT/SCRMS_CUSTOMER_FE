import React from "react";
import { Select, DatePicker } from "antd";

const { RangePicker } = DatePicker;

const TransactionFilters = ({ filters, setFilters }) => {
  return (
    <div className="flex gap-4 mb-4">
      <Select
        value={filters.type}
        onChange={(value) => setFilters((prev) => ({ ...prev, type: value }))}
        className="w-48"
      >
        <Select.Option value="all">All Transactions</Select.Option>
        <Select.Option value="deposit">Deposits</Select.Option>
        <Select.Option value="payment">Payments</Select.Option>
        <Select.Option value="refund">Refunds</Select.Option>
      </Select>

      <RangePicker
        onChange={(dates) => setFilters((prev) => ({ ...prev, dateRange: dates }))}
      />
    </div>
  );
};

export default TransactionFilters;
import React, { useEffect, useState } from "react";
import { Card, Spin, message } from "antd";
import WalletOverview from "@/components/UserTransactionView/WalletOverview";
import TransactionHistoryTable from "@/components/UserTransactionView/TransactionHistoryTable";
import TransactionFilters from "@/components/UserTransactionView/TransactionFilters";
import PaginationControls from "@/components/UserTransactionView/PaginationControls";
import axios from "axios";

const sampleTransactions = [
    { id: "txn_001", date: "2024-03-10", type: "deposit", amount: 100.0, status: "Success" },
    { id: "txn_002", date: "2024-03-08", type: "payment", amount: -50.0, status: "Success" },
    { id: "txn_003", date: "2024-03-05", type: "refund", amount: 20.0, status: "Success" },
    { id: "txn_004", date: "2024-03-02", type: "deposit", amount: 200.0, status: "Pending" },
    { id: "txn_005", date: "2024-02-28", type: "payment", amount: -75.0, status: "Failed" },
];

const UserTransactionView = () => {
    const [wallet, setWallet] = useState({ balance: 500, total_transactions: 5 });
    const [transactions, setTransactions] = useState(sampleTransactions); // Ensure transactions is an array
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({ type: "all", dateRange: null });
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    // Comment out API integration for now
    /*
    useEffect(() => {
      const fetchWalletData = async () => {
        try {
          const [walletRes, transactionsRes] = await Promise.all([
            axios.get("/api/payments/wallet"),
            axios.get("/api/payments/wallet/transactions"),
          ]);
          setWallet(walletRes.data);
          setTransactions(transactionsRes.data);
        } catch (error) {
          message.error("Failed to load wallet data");
        } finally {
          setLoading(false);
        }
      };
      fetchWalletData();
    }, []);
    */

    // Ensure transactions is always an array before filtering
    const filteredTransactions = Array.isArray(transactions)
        ? transactions.filter((tx) => {
            if (filters.type !== "all" && tx.type !== filters.type) return false;
            return true;
        })
        : [];

    const paginatedTransactions = filteredTransactions.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Spin size="large" />
            </div>
        );
    }

    return (
            <Card title="💰 Wallet & Transactions">
                <WalletOverview wallet={wallet} />
                <TransactionFilters filters={filters} setFilters={setFilters} />
                <TransactionHistoryTable transactions={paginatedTransactions} />
                <PaginationControls
                    total={filteredTransactions.length}
                    pageSize={pageSize}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            </Card>
    );
};

export default UserTransactionView;

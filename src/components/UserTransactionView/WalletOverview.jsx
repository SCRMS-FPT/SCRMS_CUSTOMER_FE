import React from "react";
import { Card, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { CreditCardOutlined } from "@ant-design/icons";

const WalletOverview = ({ wallet }) => {
  const navigate = useNavigate();

return (
    <Card className="mb-4">
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-lg font-semibold">Current Balance</h2>
                <p className="text-2xl font-bold text-green-600">${wallet?.balance.toFixed(2)}</p>
                <p>Total Transactions: {wallet?.total_transactions}</p>
            </div>
            <Button type="primary" size="large" onClick={() => navigate("/wallet/deposit")}>
                <CreditCardOutlined /> Deposit Money
            </Button>
        </div>
    </Card>
);
};

export default WalletOverview;
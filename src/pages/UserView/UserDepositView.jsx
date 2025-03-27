import React, { useState } from "react";
import { Card, Form, InputNumber, Select, Button, Modal, message, Row, Col, Typography } from "antd";
import { CreditCardOutlined, BankOutlined, WalletOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Option } = Select;
const { Title, Text } = Typography;

const UserDepositView = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [depositDetails, setDepositDetails] = useState(null);
  const navigate = useNavigate();

  const handleDeposit = (values) => {
    if (values.amount < 10) {
      message.error("Minimum deposit amount is $10");
      return;
    }
    setDepositDetails(values);
    setIsModalVisible(true);
  };

  const confirmDeposit = () => {
    setIsModalVisible(false);
    setTimeout(() => {
      message.success(`$${depositDetails.amount} deposited successfully via ${depositDetails.payment_method}`);
      navigate("/user/transactions");
    }, 1500);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <Card 
        title={
          <div className="flex items-center space-x-2">
            <CreditCardOutlined style={{ color: "#155DFC", fontSize: "1.5rem" }} />
            <Title level={4} className="m-0">Deposit Money</Title>
          </div>
        }
        className="w-full max-w-lg shadow-lg rounded-lg bg-white"
      >
        <Form 
          layout="vertical" 
          form={form} 
          onFinish={handleDeposit} 
          className="space-y-4"
        >
          {/* Deposit Amount */}
          <Form.Item
            name="amount"
            label={<Text strong>Enter Amount</Text>}
            rules={[{ required: true, message: "Please enter a deposit amount" }]}
          >
            <InputNumber
              min={10}
              max={10000}
              className="w-full"
              style={{ padding: "8px", width: "100%" }}
              placeholder="Enter amount (min $10)"
            />
          </Form.Item>

          {/* Payment Method */}
          <Form.Item
            name="payment_method"
            label={<Text strong>Select Payment Method</Text>}
            rules={[{ required: true, message: "Please select a payment method" }]}
          >
            <Select placeholder="Choose payment method">
              <Option value="credit_card">
                <CreditCardOutlined /> Credit Card
              </Option>
              <Option value="bank_transfer">
                <BankOutlined /> Bank Transfer
              </Option>
              <Option value="e_wallet">
                <WalletOutlined /> E-Wallet
              </Option>
            </Select>
          </Form.Item>

          {/* Submit Buttons */}
          <Row justify="space-between">
            <Col>
              <Button size="large" onClick={() => navigate("/user/transactions")}>Cancel</Button>
            </Col>
            <Col>
              <Button type="primary" size="large" htmlType="submit">Proceed to Deposit</Button>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* Confirmation Modal */}
      <Modal
        title={<div className="flex items-center space-x-2"><CheckCircleOutlined style={{ color: "#28A745", fontSize: "1.5rem" }} /><span>Confirm Deposit</span></div>}
        open={isModalVisible}
        onOk={confirmDeposit}
        onCancel={() => setIsModalVisible(false)}
        okText="Confirm"
        cancelText="Cancel"
      >
        <p><Text strong>Amount:</Text> ${depositDetails?.amount}</p>
        <p><Text strong>Payment Method:</Text> {depositDetails?.payment_method.replace("_", " ")}</p>
        <Text type="secondary">Do you want to proceed with this deposit?</Text>
      </Modal>
    </div>
  );
};

export default UserDepositView;

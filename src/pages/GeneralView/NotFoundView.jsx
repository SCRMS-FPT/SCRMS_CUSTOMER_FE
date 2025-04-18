import React from "react";
import { Button, Card, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import image404 from "@/assets/404_image.jpg";

const { Title, Paragraph } = Typography;

const NotFoundView = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100 p-4">
      <Card
        className="max-w-md w-full text-center"
        bordered={false}
        style={{
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
          borderRadius: "10px",
        }}
      >
        <img
          src={image404}
          alt="404 Không tìm thấy"
          className="w-full mb-4 rounded"
          style={{ objectFit: "cover", maxHeight: "300px" }}
        />
        <Title level={2} style={{ color: "#333" }}>404 - Không tìm thấy trang</Title>
        <Paragraph style={{ fontSize: "1.1rem", color: "#555" }}>
          Rất tiếc! Trang bạn đang tìm kiếm không tồn tại.
        </Paragraph>
        <Button
          type="primary"
          size="large"
          onClick={() => navigate("/")}
          style={{ marginTop: "20px", borderRadius: "5px" }}
        >
          Quay về trang chủ
        </Button>
      </Card>
    </div>
  );
};

export default NotFoundView;

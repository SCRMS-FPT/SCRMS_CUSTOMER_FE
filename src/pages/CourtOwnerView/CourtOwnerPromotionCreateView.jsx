import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Form, Input, Select, DatePicker, Button, Upload, message } from "antd";
import { LeftOutlined, UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Option } = Select;

// Mock promotions data (Replace with API fetch)
const mockPromotions = [
  { id: "P001", title: "Spring Discount", discount: 20, status: "Active", start_date: "2025-03-10", end_date: "2025-04-10", description: "Spring season discount!" },
  { id: "P002", title: "Weekend Special", discount: 15, status: "Expired", start_date: "2025-02-01", end_date: "2025-02-28", description: "Special weekend offer!" },
];

const CourtOwnerPromotionCreateView = () => {
  const { promotionId } = useParams(); // Get promotion ID from URL (if editing)
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isEditMode, setIsEditMode] = useState(false);
  const [imageList, setImageList] = useState([]);

  useEffect(() => {
    if (promotionId) {
      setIsEditMode(true);
      const promo = mockPromotions.find((p) => p.id === promotionId);
      if (promo) {
        form.setFieldsValue({
          ...promo,
          start_date: dayjs(promo.start_date),
          end_date: dayjs(promo.end_date),
        });
      }
    }
  }, [promotionId, form]);

  const handleSubmit = (values) => {
    const formattedData = {
      ...values,
      start_date: values.start_date.format("YYYY-MM-DD"),
      end_date: values.end_date.format("YYYY-MM-DD"),
      image: imageList.length ? imageList[0].url || URL.createObjectURL(imageList[0].originFileObj) : null,
    };

    console.log(isEditMode ? "Updated Promotion:" : "Created Promotion:", formattedData);
    message.success(isEditMode ? "Promotion updated successfully!" : "Promotion created successfully!");
    navigate("/court-owner/promotions");
  };

  return (
    <Card
      title={
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3>{isEditMode ? "Edit Promotion" : "Create Promotion"}</h3>
          <Button type="primary" icon={<LeftOutlined />} onClick={() => navigate("/court-owner/promotions")}>
            Go Back
          </Button>
        </div>
      }
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item name="title" label="Promotion Title" rules={[{ required: true, message: "Please enter a title" }]}>
          <Input placeholder="Enter promotion title" />
        </Form.Item>

        <Form.Item name="discount" label="Discount (%)" rules={[{ required: true, message: "Enter discount percentage" }]}>
          <Input type="number" min={1} max={100} placeholder="e.g. 20" />
        </Form.Item>

        <Form.Item name="status" label="Status" rules={[{ required: true, message: "Select a status" }]}>
          <Select placeholder="Select promotion status">
            <Option value="Active">Active</Option>
            <Option value="Upcoming">Upcoming</Option>
            <Option value="Expired">Expired</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Promotion Duration">
          <Form.Item name="start_date" style={{ display: "inline-block", width: "48%", marginRight: "4%" }} rules={[{ required: true, message: "Select start date" }]}>
            <DatePicker placeholder="Start Date" format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item name="end_date" style={{ display: "inline-block", width: "48%" }} rules={[{ required: true, message: "Select end date" }]}>
            <DatePicker placeholder="End Date" format="YYYY-MM-DD" />
          </Form.Item>
        </Form.Item>

        <Form.Item name="description" label="Description">
          <Input.TextArea rows={3} placeholder="Enter promotion description" />
        </Form.Item>

        <Form.Item label="Promotion Image">
          <Upload
            listType="picture"
            fileList={imageList}
            onChange={({ fileList }) => setImageList(fileList)}
            beforeUpload={() => false} // Prevent automatic upload
          >
            <Button icon={<UploadOutlined />}>Upload Image</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {isEditMode ? "Save Promotion" : "Create Promotion"}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CourtOwnerPromotionCreateView;

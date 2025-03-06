import React, { useState } from "react";
import { Form, InputNumber, DatePicker, TimePicker, Button, message } from "antd";
import { useNavigate } from "react-router-dom";

const CourtSlotForm = ({ initialData = null, onCancel }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSubmit = (values) => {
    console.log("Slot Data:", values);
    message.success(initialData ? "Slot Updated Successfully" : "Slot Created Successfully");
    navigate("/slots");
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={initialData}>
      <Form.Item name="slot_date" label="Booking Date" rules={[{ required: true, message: "Required" }]}>
        <DatePicker />
      </Form.Item>

      <Form.Item name="start_time" label="Start Time" rules={[{ required: true, message: "Required" }]}>
        <TimePicker format="HH:mm" />
      </Form.Item>

      <Form.Item name="end_time" label="End Time" rules={[{ required: true, message: "Required" }]}>
        <TimePicker format="HH:mm" />
      </Form.Item>

      <Form.Item name="price_slot" label="Price" rules={[{ required: true, message: "Required" }]}>
        <InputNumber min={0} />
      </Form.Item>

      <Button type="primary" htmlType="submit">Save</Button>
      <Button onClick={onCancel} className="ml-2">Cancel</Button>
    </Form>
  );
};

export default CourtSlotForm;

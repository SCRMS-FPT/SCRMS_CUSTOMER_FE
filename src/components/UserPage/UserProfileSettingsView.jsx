import React, { useState } from "react";
import { Form, Input, Button, Card, message, Upload, Checkbox, Collapse, Switch } from "antd";
import { 
  UserOutlined, MailOutlined, PhoneOutlined, HomeOutlined, LockOutlined, UploadOutlined 
} from "@ant-design/icons";

const { Panel } = Collapse;

const UserProfileSettingsView = () => {
  const [form] = Form.useForm();
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  const onUpdateProfile = (values) => {
    console.log("Updated Profile:", values);
    message.success("Thông tin cá nhân được cập nhật thành công!");
  };

  const onUpdatePreferences = (values) => {
    console.log("Updated Preferences:", values);
    message.success("Các tùy chọn đã được cập nhật thành công!");
  };

  return (
    <div className="space-y-6">
      {/* Personal Information Section */}
      <Card title="Personal Information" bordered={false} className="shadow-lg rounded-lg" style={{ background: "linear-gradient(135deg, #ffffff, #f0f5ff)", padding: "24px" }}>
        <Form form={form} layout="vertical" onFinish={onUpdateProfile} initialValues={{
          fullName: "John Doe",
          email: "john@example.com",
          phone: "123-456-7890",
          address: "123 Main St, Anytown, USA",
          aboutMe: "I am a software engineer passionate about building great applications."
        }}>
          <Form.Item label="Profile Picture">
            <Upload listType="picture" maxCount={1} beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>Cập nhật ảnh</Button>
            </Upload>
          </Form.Item>
          <Form.Item label="Full Name" name="fullName" rules={[{ required: true, message: "Vui lòng nhập tên đầy đủ" }]}>
            <Input placeholder="Nhập tên đầy đủ" prefix={<UserOutlined style={{ color: "#1890ff" }} />} size="large" />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, message: "Vui lòng nhập email của bạn" }, { type: "email", message: "Enter a valid email address" }]}>
            <Input placeholder="Nhập email của bạn" prefix={<MailOutlined style={{ color: "#1890ff" }} />} size="large" />
          </Form.Item>
          <Form.Item label="Phone" name="phone" rules={[{ required: true, message: "Vui lòng nhập số điện thoại của bạn" }]}>
            <Input placeholder="Nhập số điện thoại" prefix={<PhoneOutlined style={{ color: "#1890ff" }} />} size="large" />
          </Form.Item>
          <Form.Item label="Address" name="address" rules={[{ required: true, message: "Vui lòng nhập địa chỉ của bạn" }]}>
            <Input placeholder="Nhập địa chỉ" prefix={<HomeOutlined style={{ color: "#1890ff" }} />} size="large" />
          </Form.Item>
          <Form.Item label="Mô tả về tôi" name="aboutMe">
            <Input.TextArea rows={3} placeholder="Kể cho chúng tôi về bạn..." />
          </Form.Item>
          <div className="text-center">
            <Button type="primary" htmlType="submit" size="large" style={{ width: "50%", borderRadius: "8px" }}>
              Cập nhật thông tin
            </Button>
          </div>
        </Form>
      </Card>

      {/* Change Password Section */}
      <Card title="Bảo mật tài khoản" bordered={false} className="shadow-lg rounded-lg" style={{ background: "linear-gradient(135deg, #ffffff, #f0f5ff)", padding: "24px" }}>
        <div className="text-center">
          <Button type="dashed" size="large" onClick={() => setShowPasswordChange(!showPasswordChange)}>
            {showPasswordChange ? "Hủy thay đổi mật khẩu" : "Đổi mật khẩu"}
          </Button>
        </div>
        {showPasswordChange && (
          <Form form={form} layout="vertical" onFinish={onUpdateProfile} className="mt-4">
            <Form.Item label="Mật khẩu mới" name="password" rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới của bạn" }]}>
              <Input.Password placeholder="Nhập mật khẩu mới" prefix={<LockOutlined style={{ color: "#1890ff" }} />} size="large" />
            </Form.Item>
            <Form.Item label="Mật khẩu xác nhận" name="confirmPassword" dependencies={["password"]}
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu xác nhận" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Mật khẩu xác nhận không trùng với mật khẩu mới!"));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Nhập mật khẩu xác nhận" prefix={<LockOutlined style={{ color: "#1890ff" }} />} size="large" />
            </Form.Item>
            <div className="text-center">
              <Button type="primary" htmlType="submit" size="large" style={{ width: "50%", borderRadius: "8px" }}>
                Cập nhật mật khẩu
              </Button>
            </div>
          </Form>
        )}
      </Card>

      {/* Preferences Section */}
      <Card title="Tùy chỉnh tài khoản" bordered={false} className="shadow-lg rounded-lg" style={{ background: "linear-gradient(135deg, #ffffff, #f0f5ff)", padding: "24px" }}>
        <Form form={form} layout="vertical" onFinish={onUpdatePreferences} initialValues={{ newsletter: true }}>
          <Form.Item name="newsletter" valuePropName="checked">
            <Checkbox>Đăng kí Newsletter</Checkbox>
          </Form.Item>
          <div className="text-center">
            <Button type="primary" htmlType="submit" size="large" style={{ width: "50%", borderRadius: "8px" }}>
              Cập nhật tùy chỉnh
            </Button>
          </div>
        </Form>
      </Card>

      {/* Notifications Section */}
      <Card title="Thông báo" bordered={false} className="shadow-lg rounded-lg" style={{ background: "linear-gradient(135deg, #ffffff, #f0f5ff)", padding: "24px" }}>
        <Form form={form} layout="vertical" onFinish={onUpdatePreferences} initialValues={{ emailNotifications: true }}>
          <Form.Item name="emailNotifications" valuePropName="checked">
            <div className="flex justify-between items-center">
              <span>Thông báo qua email</span>
              <Switch defaultChecked />
            </div>
          </Form.Item>
          <div className="text-center">
            <Button type="primary" htmlType="submit" size="large" style={{ width: "50%", borderRadius: "8px" }}>
              Cập nhật thông báo
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default UserProfileSettingsView;

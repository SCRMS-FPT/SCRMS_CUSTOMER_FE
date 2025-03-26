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
    message.success("Profile updated successfully!");
  };

  const onUpdatePreferences = (values) => {
    console.log("Updated Preferences:", values);
    message.success("Preferences updated successfully!");
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
              <Button icon={<UploadOutlined />}>Upload Picture</Button>
            </Upload>
          </Form.Item>
          <Form.Item label="Full Name" name="fullName" rules={[{ required: true, message: "Please enter your full name" }]}>
            <Input placeholder="Enter your full name" prefix={<UserOutlined style={{ color: "#1890ff" }} />} size="large" />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, message: "Please enter your email" }, { type: "email", message: "Enter a valid email address" }]}>
            <Input placeholder="Enter your email" prefix={<MailOutlined style={{ color: "#1890ff" }} />} size="large" />
          </Form.Item>
          <Form.Item label="Phone" name="phone" rules={[{ required: true, message: "Please enter your phone number" }]}>
            <Input placeholder="Enter your phone number" prefix={<PhoneOutlined style={{ color: "#1890ff" }} />} size="large" />
          </Form.Item>
          <Form.Item label="Address" name="address" rules={[{ required: true, message: "Please enter your address" }]}>
            <Input placeholder="Enter your address" prefix={<HomeOutlined style={{ color: "#1890ff" }} />} size="large" />
          </Form.Item>
          <Form.Item label="About Me" name="aboutMe">
            <Input.TextArea rows={3} placeholder="Tell us about yourself..." />
          </Form.Item>
          <div className="text-center">
            <Button type="primary" htmlType="submit" size="large" style={{ width: "50%", borderRadius: "8px" }}>
              Update Profile
            </Button>
          </div>
        </Form>
      </Card>

      {/* Change Password Section */}
      <Card title="Account Security" bordered={false} className="shadow-lg rounded-lg" style={{ background: "linear-gradient(135deg, #ffffff, #f0f5ff)", padding: "24px" }}>
        <div className="text-center">
          <Button type="dashed" size="large" onClick={() => setShowPasswordChange(!showPasswordChange)}>
            {showPasswordChange ? "Cancel Change Password" : "Change Password"}
          </Button>
        </div>
        {showPasswordChange && (
          <Form form={form} layout="vertical" onFinish={onUpdateProfile} className="mt-4">
            <Form.Item label="New Password" name="password" rules={[{ required: true, message: "Please enter your new password" }]}>
              <Input.Password placeholder="Enter new password" prefix={<LockOutlined style={{ color: "#1890ff" }} />} size="large" />
            </Form.Item>
            <Form.Item label="Confirm Password" name="confirmPassword" dependencies={["password"]}
              rules={[{ required: true, message: "Please confirm your new password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match!"));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm new password" prefix={<LockOutlined style={{ color: "#1890ff" }} />} size="large" />
            </Form.Item>
            <div className="text-center">
              <Button type="primary" htmlType="submit" size="large" style={{ width: "50%", borderRadius: "8px" }}>
                Update Password
              </Button>
            </div>
          </Form>
        )}
      </Card>

      {/* Preferences Section */}
      <Card title="Preferences" bordered={false} className="shadow-lg rounded-lg" style={{ background: "linear-gradient(135deg, #ffffff, #f0f5ff)", padding: "24px" }}>
        <Form form={form} layout="vertical" onFinish={onUpdatePreferences} initialValues={{ newsletter: true }}>
          <Form.Item name="newsletter" valuePropName="checked">
            <Checkbox>Subscribe to Newsletter</Checkbox>
          </Form.Item>
          <div className="text-center">
            <Button type="primary" htmlType="submit" size="large" style={{ width: "50%", borderRadius: "8px" }}>
              Update Preferences
            </Button>
          </div>
        </Form>
      </Card>

      {/* Notifications Section */}
      <Card title="Notifications" bordered={false} className="shadow-lg rounded-lg" style={{ background: "linear-gradient(135deg, #ffffff, #f0f5ff)", padding: "24px" }}>
        <Form form={form} layout="vertical" onFinish={onUpdatePreferences} initialValues={{ emailNotifications: true }}>
          <Form.Item name="emailNotifications" valuePropName="checked">
            <div className="flex justify-between items-center">
              <span>Email Notifications</span>
              <Switch defaultChecked />
            </div>
          </Form.Item>
          <div className="text-center">
            <Button type="primary" htmlType="submit" size="large" style={{ width: "50%", borderRadius: "8px" }}>
              Update Notifications
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default UserProfileSettingsView;

import {
  Form,
  Input,
  Button,
  Typography,
  Card,
  notification,
  Space,
} from "antd";
import {
  LockOutlined,
  KeyOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Client, ChangePasswordRequest, ApiException } from "@/API/IdentityApi";

const { Title, Text } = Typography;

export default function ChangePasswordPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const client = new Client();

  const onFinish = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      notification.error({
        message: "Lỗi",
        description: "Mật khẩu mới và xác nhận mật khẩu không khớp.",
        placement: "topRight",
      });
      return;
    }

    try {
      var request = new ChangePasswordRequest();
      request.oldPassword = values.currentPassword;
      request.newPassword = values.newPassword;
      await client.changePassword(request);
      notification.success({
        message: "Đổi mật khẩu thành công",
        description: "Mật khẩu của bạn đã được cập nhật.",
        placement: "topRight",
      });
    } catch (error) {
      if (error instanceof ApiException) {
        const errorMsg = "đã có lỗi xảy ra";
        try {
          const errorResponse = JSON.parse(error.response);
          errorMsg = errorResponse.detail || errorMsg;
        } catch (e) {
          errorMsg = e.message || errorMsg;
        }
      }
      notification.error({
        message: "Lỗi",
        description: `Không thể đổi mật khẩu do ${error.message}.`,
        placement: "topRight",
      });
    }

    form.resetFields();
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div
        className="container mx-auto px-4 py-8 max-w-md"
        style={{ marginTop: "2rem", marginBottom: "2rem" }}
      >
        <Card
          variant="borderless"
          className="shadow-xl rounded-xl p-6 border border-gray-300"
          style={{
            background: "linear-gradient(135deg, #ffffff, #f8f8f8)",
          }}
        >
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <div className="text-center">
              <Title level={2}>Đổi mật khẩu</Title>
              <Text type="secondary">
                Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người
                khác
              </Text>
            </div>

            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Form.Item
                name="currentPassword"
                label="Mật khẩu hiện tại"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mật khẩu hiện tại!",
                  },
                  { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự" },
                  {
                    pattern:
                      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).*$/,
                    message:
                      "Mật khẩu phải chứa ít nhất một chữ cái viết hoa, một chữ số và một ký tự đặc biệt",
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Nhập mật khẩu hiện tại"
                />
              </Form.Item>

              <Form.Item
                name="newPassword"
                label="Mật khẩu mới"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu mới!" },
                  { min: 8, message: "Mật khẩu phải có ít nhất 8 ký tự" },
                  {
                    pattern:
                      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).*$/,
                    message:
                      "Mật khẩu phải chứa ít nhất một chữ cái viết hoa, một chữ số và một ký tự đặc biệt",
                  },
                ]}
              >
                <Input.Password
                  prefix={<KeyOutlined />}
                  placeholder="Nhập mật khẩu mới"
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label="Xác nhận mật khẩu mới"
                dependencies={["newPassword"]}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng xác nhận mật khẩu mới!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newPassword") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(
                          "Mật khẩu xác nhận không khớp với mật khẩu mới!"
                        )
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<KeyOutlined />}
                  placeholder="Xác nhận mật khẩu mới"
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Cập nhật mật khẩu
                </Button>
              </Form.Item>
            </Form>

            <Button
              type="link"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/profile")}
            >
              Quay lại trang thông tin cá nhân
            </Button>
          </Space>
        </Card>
      </div>
    </div>
  );
}

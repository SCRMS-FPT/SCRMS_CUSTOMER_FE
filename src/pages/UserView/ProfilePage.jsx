import { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Radio,
  Typography,
  Space,
  notification,
  Avatar,
  Card,
  Divider,
} from "antd";
import { UserOutlined, SaveOutlined, EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import locale from "antd/lib/date-picker/locale/vi_VN";
import { Client } from "@/API/IdentityApi";

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function ProfilePage() {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const client = new Client("http://localhost:6001", null);
  const [initialValues, setInitialValues] = useState({
    firstName: "Nguyễn",
    lastName: "Văn A",
    phone: "0912345678",
    birthDate: dayjs("1990-01-01"),
    gender: "male",
    introduction:
      "Tôi là một người đam mê công nghệ và thích khám phá những điều mới mẻ.",
  });

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await client.getProfile();
        const formattedData = {
          ...response,
          birthDate: response.birthDate ? dayjs(response.birthDate) : null,
        };
        setInitialValues(formattedData);
        form.setFieldsValue(formattedData);
      } catch (error) {
        console.log(error);
        notification.error({
          message: "Lỗi tải thông tin",
          description: "Không thể lấy thông tin người dùng.",
        });
      }
    };

    getUser();
  }, []);

  const onFinish = async (values) => {
    try {
      const payload = {
        ...values,
        birthDate: values.birthDate ? values.birthDate.toISOString() : null,
      };

      await client.updateProfile(payload);
      notification.success({
        message: "Cập nhật thành công",
        description: "Thông tin cá nhân của bạn đã được cập nhật.",
      });

      setIsEditing(false);
      setInitialValues(payload);
    } catch (error) {
      console.error(error);
      notification.error({
        message: "Lỗi cập nhật",
        description: "Không thể cập nhật thông tin cá nhân.",
      });
    }
  };

  if (!initialValues) return <p>Đang tải...</p>;

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div
        className="container mx-auto px-4 py-8 max-w-4xl"
        style={{ marginTop: "2rem", marginBottom: "2rem" }}
      >
        <Card
          variant="borderless"
          className="shadow-xl rounded-xl p-6 border border-gray-300"
          title={
            <div className="flex items-center">
              <Avatar size={64} icon={<UserOutlined />} className="mr-4" />
              <Title level={2} style={{ margin: 0 }}>
                Thông tin cá nhân
              </Title>
            </div>
          }
          extra={
            <Button
              type={isEditing ? "default" : "primary"}
              icon={isEditing ? <SaveOutlined /> : <EditOutlined />}
              onClick={() => {
                if (isEditing) {
                  form.submit();
                } else {
                  setIsEditing(true);
                }
              }}
            >
              {isEditing ? "Lưu thông tin" : "Chỉnh sửa"}
            </Button>
          }
        >
          <Form
            form={form}
            layout="vertical"
            initialValues={initialValues}
            onFinish={onFinish}
            disabled={!isEditing}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Form.Item
                name="firstName"
                label="Họ"
                rules={[
                  { required: true, message: "Vui lòng nhập họ của bạn!" },
                ]}
              >
                <Input placeholder="Nhập họ của bạn" />
              </Form.Item>

              <Form.Item
                name="lastName"
                label="Tên"
                rules={[
                  { required: true, message: "Vui lòng nhập tên của bạn!" },
                ]}
              >
                <Input placeholder="Nhập tên của bạn" />
              </Form.Item>
            </div>

            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
                {
                  pattern: /^[0-9]{10}$/,
                  message: "Số điện thoại không hợp lệ!",
                },
              ]}
            >
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>

            <Form.Item
              name="birthDate"
              label="Ngày sinh"
              rules={[{ required: true, message: "Vui lòng chọn ngày sinh!" }]}
            >
              <DatePicker
                locale={locale}
                format="DD/MM/YYYY"
                style={{ width: "100%" }}
                placeholder="Chọn ngày sinh"
              />
            </Form.Item>

            <Form.Item
              name="gender"
              label="Giới tính"
              rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
            >
              <Radio.Group>
                <Space direction="horizontal">
                  <Radio value="Male">Nam</Radio>
                  <Radio value="Female">Nữ</Radio>
                  <Radio value="Other">Khác</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>

            <Form.Item name="introduction" label="Giới thiệu bản thân">
              <TextArea
                rows={4}
                placeholder="Nhập giới thiệu về bản thân bạn"
                showCount
                maxLength={500}
              />
            </Form.Item>
          </Form>

          <Divider />

          <div className="flex justify-between">
            <Button type="default" href="/change-password">
              Đổi mật khẩu
            </Button>

            {isEditing && (
              <Button
                danger
                onClick={() => {
                  form.setFieldsValue(initialValues);
                  setIsEditing(false);
                  notification.info({
                    message: "Đã hủy",
                    description: "Các thay đổi đã được hủy bỏ.",
                  });
                }}
              >
                Hủy
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

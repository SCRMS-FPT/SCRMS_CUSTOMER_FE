import { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Radio,
  Typography,
  notification,
  Avatar,
  Card,
  Badge,
} from "antd";
import {
  UserOutlined,
  SaveOutlined,
  EditOutlined,
  LockOutlined,
  CrownOutlined,
  BellOutlined,
  PhoneOutlined,
  CalendarOutlined,
  ManOutlined,
  WomanOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import locale from "antd/lib/date-picker/locale/vi_VN";
import { Client } from "@/API/IdentityApi";

const { Title, Text, Paragraph } = Typography;
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
    selfIntroduction:
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
      } catch (error) {
        notification.error({
          message: "Lỗi tải thông tin",
          description: "Không thể lấy thông tin người dùng.",
        });
      }
    };

    getUser();
  }, []);

  const menuItems = [
    {
      key: "password",
      icon: <LockOutlined />,
      text: "Đổi mật khẩu",
      href: "/change-password",
      color: "#1890ff",
    },
    {
      key: "membership",
      icon: <CrownOutlined />,
      text: "Gói đăng ký",
      href: "/membership",
      color: "#faad14",
      badge: true,
    },
    {
      key: "notifications",
      icon: <BellOutlined />,
      text: "Thông báo",
      href: "/notifications",
      color: "#52c41a",
      badge: true,
      // count: 5,
    },
  ];

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
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen flex items-center justify-center py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <Card
          variant="borderless"
          className="shadow-2xl rounded-2xl overflow-hidden"
          styles={{ body: { padding: "0" } }}
        >
          <div
            className="bg-gradient-to-r from-blue-500 to-cyan-400 p-8 relative"
            style={{
              height: "6rem",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent"></div>
          </div>

          {/* Profile Info Section */}
          <div className="px-8 pt-0 pb-6 relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end -mt-16 mb-6 relative z-10">
              <div className="flex items-end">
                <Avatar
                  size={120}
                  icon={<UserOutlined />}
                  className="border-4 border-white shadow-lg"
                  style={{ backgroundColor: "#1890ff" }}
                />
                <div className="ml-4 mb-2">
                  <Title level={2} style={{ margin: 0 }}>
                    {initialValues.firstName} {initialValues.lastName}
                  </Title>
                  <Text type="secondary">
                    Thành viên từ {dayjs().format("MM/YYYY")}
                  </Text>
                </div>
              </div>

              <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
                <Button
                  type={isEditing ? "default" : "primary"}
                  icon={isEditing ? <SaveOutlined /> : <EditOutlined />}
                  size="large"
                  className="shadow-md"
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
              </div>
            </div>

            <div className="mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {menuItems.map((item) => (
                  <a key={item.key} href={item.href} className="block">
                    <Card
                      hoverable
                      className="text-center h-full transition-all duration-300 transform hover:scale-105"
                      style={{ body: { padding: "16px" } }}
                    >
                      <div className="flex flex-col items-center justify-center">
                        {item.badge ? (
                          <Badge count={item.count || 0} dot={!item.count}>
                            <div
                              className="flex items-center justify-center w-12 h-12 rounded-full mb-2"
                              style={{ backgroundColor: `${item.color}20` }}
                            >
                              <span
                                style={{ color: item.color, fontSize: "24px" }}
                              >
                                {item.icon}
                              </span>
                            </div>
                          </Badge>
                        ) : (
                          <div
                            className="flex items-center justify-center w-12 h-12 rounded-full mb-2"
                            style={{ backgroundColor: `${item.color}20` }}
                          >
                            <span
                              style={{ color: item.color, fontSize: "24px" }}
                            >
                              {item.icon}
                            </span>
                          </div>
                        )}
                        <Text strong>{item.text}</Text>
                      </div>
                    </Card>
                  </a>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              {!isEditing && (
                <div className="mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="mb-4">
                        <Text type="secondary" className="block mb-1">
                          Họ và tên
                        </Text>
                        <Text strong className="text-lg">
                          {initialValues.firstName} {initialValues.lastName}
                        </Text>
                      </div>
                      <div className="mb-4">
                        <Text type="secondary" className="block mb-1">
                          <PhoneOutlined className="mr-2" />
                          Số điện thoại
                        </Text>
                        <Text strong className="text-lg">
                          {initialValues.phone}
                        </Text>
                      </div>
                    </div>
                    <div>
                      <div className="mb-4">
                        <Text type="secondary" className="block mb-1">
                          <CalendarOutlined className="mr-2" />
                          Ngày sinh
                        </Text>
                        <Text strong className="text-lg">
                          {dayjs(initialValues.birthDate).format("DD/MM/YYYY")}
                        </Text>
                      </div>
                      <div className="mb-4">
                        <Text type="secondary" className="block mb-1">
                          {initialValues.gender === "Male" ? (
                            <ManOutlined className="mr-2" />
                          ) : (
                            <WomanOutlined className="mr-2" />
                          )}
                          Giới tính
                        </Text>
                        <Text strong className="text-lg">
                          {initialValues.gender === "Male"
                            ? "Nam"
                            : initialValues.gender === "Female"
                            ? "Nữ"
                            : "Khác"}
                        </Text>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Text type="secondary" className="block mb-1">
                      <FileTextOutlined className="mr-2" />
                      Giới thiệu bản thân
                    </Text>
                    <Paragraph className="bg-white p-4 rounded border border-gray-200">
                      {initialValues.selfIntroduction}
                    </Paragraph>
                  </div>
                </div>
              )}

              {isEditing && (
                <Form
                  form={form}
                  layout="vertical"
                  initialValues={initialValues}
                  onFinish={onFinish}
                  className="p-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Form.Item
                      name="firstName"
                      label="Họ"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập họ của bạn!",
                        },
                      ]}
                    >
                      <Input placeholder="Nhập họ của bạn" size="large" />
                    </Form.Item>

                    <Form.Item
                      name="lastName"
                      label="Tên"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập tên của bạn!",
                        },
                      ]}
                    >
                      <Input placeholder="Nhập tên của bạn" size="large" />
                    </Form.Item>
                  </div>

                  <Form.Item
                    name="phone"
                    label="Số điện thoại"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập số điện thoại!",
                      },
                      {
                        pattern: /^[0-9]{10}$/,
                        message: "Số điện thoại không hợp lệ!",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Nhập số điện thoại"
                      size="large"
                      prefix={<PhoneOutlined className="text-gray-400" />}
                    />
                  </Form.Item>

                  <Form.Item
                    name="birthDate"
                    label="Ngày sinh"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn ngày sinh!",
                      },
                    ]}
                  >
                    <DatePicker
                      locale={locale}
                      format="DD/MM/YYYY"
                      style={{ width: "100%" }}
                      placeholder="Chọn ngày sinh"
                      size="large"
                      suffixIcon={
                        <CalendarOutlined className="text-gray-400" />
                      }
                    />
                  </Form.Item>

                  <Form.Item
                    name="gender"
                    label="Giới tính"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn giới tính!",
                      },
                    ]}
                  >
                    <Radio.Group size="large" buttonStyle="solid">
                      <Radio.Button value="Male">
                        <ManOutlined /> Nam
                      </Radio.Button>
                      <Radio.Button value="Female">
                        <WomanOutlined /> Nữ
                      </Radio.Button>
                      <Radio.Button value="Other">Khác</Radio.Button>
                    </Radio.Group>
                  </Form.Item>

                  <Form.Item
                    name="selfIntroduction"
                    label="Giới thiệu bản thân"
                  >
                    <TextArea
                      rows={4}
                      placeholder="Nhập giới thiệu về bản thân bạn"
                      showCount
                      maxLength={500}
                      size="large"
                    />
                  </Form.Item>

                  {isEditing && (
                    <div className="flex justify-end mt-4">
                      <Button
                        danger
                        size="large"
                        className="mr-2"
                        onClick={() => {
                          form.resetFields();
                          setIsEditing(false);
                          notification.info({
                            message: "Đã hủy",
                            description: "Các thay đổi đã được hủy bỏ.",
                            placement: "topRight",
                          });
                        }}
                      >
                        Hủy
                      </Button>
                      <Button type="primary" size="large" htmlType="submit">
                        Lưu thông tin
                      </Button>
                    </div>
                  )}
                </Form>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

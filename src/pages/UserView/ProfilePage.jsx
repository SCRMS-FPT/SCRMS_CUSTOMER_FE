import { useEffect, useState, useRef, useMemo } from "react";
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
  Upload,
  Space,
  Modal,
  Image as AntImage,
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
  CameraOutlined,
  DeleteOutlined,
  PictureOutlined,
  PlusOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import locale from "antd/lib/date-picker/locale/vi_VN";
import { Client, UpdateProfileRequest } from "@/API/IdentityApi";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Dragger } = Upload;

export default function ProfilePage() {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const client = new Client();
  const [initialValues, setInitialValues] = useState({
    firstName: "Nguyễn",
    lastName: "Văn A",
    phone: "0912345678",
    birthDate: dayjs("1990-01-01"),
    gender: "male",
    selfIntroduction:
      "Tôi là một người đam mê công nghệ và thích khám phá những điều mới mẻ.",
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  const avatarUrl = useMemo(() => {
    return existingImages.length > 0 ? existingImages[0] : null;
  }, [existingImages]);

  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  // Load user profile on component mount
  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        const response = await client.getProfile();

        const formattedData = {
          ...response,
          birthDate: response.birthDate ? dayjs(response.birthDate) : null,
        };

        setInitialValues(formattedData);
        setExistingImages(response.imageUrls || []);
      } catch (error) {
        notification.error({
          message: "Lỗi tải thông tin",
          description: "Không thể lấy thông tin người dùng.",
        });
      } finally {
        setLoading(false);
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
    },
  ];

  // Handle avatar upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // File size validation (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      notification.error({
        message: "Kích thước file quá lớn",
        description: "Hình ảnh không được vượt quá 5MB",
      });
      return;
    }

    // Make the new file the first image in the list
    setImageFiles((prev) => [file, ...prev]);

    // If there's an existing avatar (first image), mark it for deletion
    if (existingImages.length > 0) {
      const oldAvatarUrl = existingImages[0];
      setExistingImages((prev) => prev.filter((_, i) => i !== 0));
      setImagesToDelete((prev) => [...prev, oldAvatarUrl]);
    }
  };

  // Handle image uploads
  const handleImagesUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Validate file sizes
    const oversizedFiles = files.filter((file) => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      notification.error({
        message: "Kích thước file quá lớn",
        description:
          "Một số hình ảnh vượt quá giới hạn 5MB và sẽ không được tải lên",
      });
    }

    // Filter valid files
    const validFiles = files.filter((file) => file.size <= 5 * 1024 * 1024);

    // Add to image files state
    setImageFiles((prev) => [...prev, ...validFiles]);
  };

  // Handle removing new image
  const handleRemoveNewImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle removing existing image
  const handleRemoveExistingImage = (url) => {
    setExistingImages((prev) => prev.filter((image) => image !== url));
    setImagesToDelete((prev) => [...prev, url]);
  };

  // Preview image
  const handlePreview = (url) => {
    setPreviewImage(url);
    setPreviewTitle("Image Preview");
    setPreviewVisible(true);
  };

  // Handle form submission
  const onFinish = async (values) => {
    try {
      setLoading(true);

      // Prepare update request
      const updateRequest = new UpdateProfileRequest({
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        birthDate: values.birthDate ? values.birthDate.toISOString() : null,
        gender: values.gender,
        selfIntroduction: values.selfIntroduction,

        // Image-related fields
        newImageFiles: imageFiles.length > 0 ? imageFiles : undefined,
        existingImageUrls: existingImages,
        imagesToDelete: imagesToDelete.length > 0 ? imagesToDelete : undefined,
      });

      await client.updateProfile(updateRequest);

      // Refresh profile data
      const updatedProfile = await client.getProfile();
      const formattedData = {
        ...updatedProfile,
        birthDate: updatedProfile.birthDate
          ? dayjs(updatedProfile.birthDate)
          : null,
      };

      setInitialValues(formattedData);
      setExistingImages(updatedProfile.imageUrls || []);

      // Reset states for image uploads
      setImageFiles([]);
      setImagesToDelete([]);

      notification.success({
        message: "Cập nhật thành công",
        description: "Thông tin cá nhân của bạn đã được cập nhật.",
      });

      setIsEditing(false);
    } catch (error) {
      console.error(error);
      notification.error({
        message: "Lỗi cập nhật",
        description: "Không thể cập nhật thông tin cá nhân.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Prepare image previews
  const imageFilePreviews = imageFiles.map((file, index) => {
    return {
      uid: `new-${index}`,
      name: file.name,
      status: "done",
      url: URL.createObjectURL(file),
      thumbUrl: URL.createObjectURL(file),
    };
  });

  const existingImagePreviews = existingImages.map((url, index) => {
    return {
      uid: `existing-${index}`,
      name: `Image ${index + 1}`,
      status: "done",
      url: url,
      thumbUrl: url,
    };
  });

  const allImagePreviews = [...imageFilePreviews, ...existingImagePreviews];

  if (loading && !initialValues)
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingOutlined style={{ fontSize: 40 }} />
          <p className="mt-4">Đang tải thông tin...</p>
        </div>
      </div>
    );

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
                <div className="relative">
                  <Badge
                    count={
                      isEditing && (
                        <label
                          htmlFor="avatar-upload"
                          className="cursor-pointer"
                        >
                          <div className="bg-blue-500 p-2 rounded-full text-white border-2 border-white">
                            <CameraOutlined />
                          </div>
                        </label>
                      )
                    }
                    offset={[-5, 5]}
                  >
                    <Avatar
                      size={120}
                      src={avatarUrl}
                      icon={<UserOutlined />}
                      className="border-4 border-white shadow-lg"
                      style={{ backgroundColor: "#1890ff" }}
                    />
                  </Badge>
                  {isEditing && (
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                      ref={fileInputRef}
                    />
                  )}
                </div>
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
                  loading={loading}
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
                          {initialValues.birthDate
                            ? dayjs(initialValues.birthDate).format(
                                "DD/MM/YYYY"
                              )
                            : "Chưa cập nhật"}
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
                      {initialValues.selfIntroduction ||
                        "Chưa có thông tin giới thiệu"}
                    </Paragraph>
                  </div>

                  {/* Display profile images */}
                  {existingImages && existingImages.length > 0 && (
                    <div className="mt-6">
                      <Text type="secondary" className="block mb-2">
                        <PictureOutlined className="mr-2" />
                        Hình ảnh hồ sơ
                      </Text>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {existingImages.map((image, index) => (
                          <div
                            key={`image-${index}`}
                            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all"
                            onClick={() => handlePreview(image)}
                          >
                            <img
                              src={image}
                              alt={`Profile ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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

                  {/* Profile Images Section */}
                  <div className="mt-6 mb-6">
                    <Typography.Title level={5} className="mb-3">
                      <PictureOutlined className="mr-2" />
                      Hình ảnh hồ sơ
                    </Typography.Title>

                    <div className="mb-4">
                      <input
                        ref={imageInputRef}
                        id="images-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImagesUpload}
                      />
                      <Button
                        icon={<PlusOutlined />}
                        onClick={() => imageInputRef.current?.click()}
                      >
                        Thêm hình ảnh
                      </Button>
                    </div>

                    {/* Display image previews */}
                    {imageFiles.length > 0 || existingImages.length > 0 ? (
                      <div>
                        <div className="mb-2">
                          <Text type="secondary">
                            Hình ảnh đầu tiên sẽ được sử dụng làm ảnh đại diện.
                          </Text>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {/* New image previews */}
                          {imageFiles.map((file, index) => (
                            <div
                              key={`new-${index}`}
                              className={`relative rounded-lg overflow-hidden border ${
                                index === 0 && existingImages.length === 0
                                  ? "border-blue-500 ring-2 ring-blue-300"
                                  : "border-gray-200"
                              }`}
                            >
                              {index === 0 && existingImages.length === 0 && (
                                <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-br-lg">
                                  Ảnh đại diện
                                </div>
                              )}
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`Upload ${index}`}
                                className="w-full aspect-square object-cover"
                              />
                              <Button
                                danger
                                icon={<DeleteOutlined />}
                                size="small"
                                className="absolute top-1 right-1 bg-white/80"
                                onClick={() => handleRemoveNewImage(index)}
                              />
                            </div>
                          ))}

                          {/* Existing image previews */}
                          {existingImages.map((url, index) => (
                            <div
                              key={`existing-${index}`}
                              className={`relative rounded-lg overflow-hidden border ${
                                index === 0
                                  ? "border-blue-500 ring-2 ring-blue-300"
                                  : "border-gray-200"
                              }`}
                            >
                              {index === 0 && (
                                <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-br-lg">
                                  Ảnh đại diện
                                </div>
                              )}
                              <img
                                src={url}
                                alt={`Profile ${index}`}
                                className="w-full aspect-square object-cover"
                              />
                              <Button
                                danger
                                icon={<DeleteOutlined />}
                                size="small"
                                className="absolute top-1 right-1 bg-white/80"
                                onClick={() => handleRemoveExistingImage(url)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                        <PictureOutlined
                          style={{ fontSize: 24, color: "#bfbfbf" }}
                        />
                        <p className="mt-2 text-gray-500">
                          Chưa có hình ảnh nào được tải lên
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end mt-4">
                    <Button
                      danger
                      size="large"
                      className="mr-2"
                      onClick={() => {
                        form.resetFields();
                        setIsEditing(false);
                        setImageFiles([]);
                        setImagesToDelete([]);
                        // Reset to original values
                        setExistingImages(initialValues.imageUrls || []);
                        notification.info({
                          message: "Đã hủy",
                          description: "Các thay đổi đã được hủy bỏ.",
                          placement: "topRight",
                        });
                      }}
                    >
                      Hủy
                    </Button>
                    <Button
                      type="primary"
                      size="large"
                      htmlType="submit"
                      loading={loading}
                    >
                      Lưu thông tin
                    </Button>
                  </div>
                </Form>
              )}
            </div>
          </div>
        </Card>
      </div>
      {/* Image Preview Modal */}
      <Modal
        open={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="Preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </div>
  );
}

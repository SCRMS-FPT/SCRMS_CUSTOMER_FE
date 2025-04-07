import React, { useState } from "react";
import {
  Card,
  Form,
  message,
  Button,
  Input,
  Upload,
  Row,
  Col,
  Spin,
  Divider,
} from "antd";
import { useNavigate } from "react-router-dom";
import { LeftOutlined, UploadOutlined, PlusOutlined } from "@ant-design/icons";
import { Client } from "@/API/CourtApi";

import VenueBasicForm from "@/components/CourtOwnerVenueCreateView/VenueBasicForm";
import VenueSportsAmenitiesForm from "@/components/CourtOwnerVenueCreateView/VenueSportsAmenitiesForm";
import VenueOperatingHoursForm from "@/components/CourtOwnerVenueCreateView/VenueOperatingHoursForm";
import VenuePricingForm from "@/components/CourtOwnerVenueCreateView/VenuePricingForm";
import VenueBookingPolicyForm from "@/components/CourtOwnerVenueCreateView/VenueBookingPolicyForm";
import VenueFormActions from "@/components/CourtOwnerVenueCreateView/VenueFormActions";

const CourtOwnerVenueCreateView = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // State for images
  const [avatarFile, setAvatarFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);

  // State for venue/sport center data
  const [sportCenter, setSportCenter] = useState({
    name: "",
    phoneNumber: "",
    addressLine: "",
    city: "",
    district: "",
    commune: "",
    description: "",
    imageUrls: [],
    avatar: "",
  });

  // Custom upload handler for avatar
  const customAvatarUpload = async ({ file, onSuccess }) => {
    try {
      // Store the file in state
      setAvatarFile(file);

      // In a real implementation, you'd upload to server first
      // For now, we'll just simulate success
      setTimeout(() => {
        onSuccess("ok");
      }, 500);
    } catch (error) {
      console.error("Error uploading avatar:", error);
      message.error("Tải ảnh Logo thất bại!");
    }
  };

  // Custom upload handler for gallery images
  const customGalleryUpload = async ({ file, onSuccess }) => {
    try {
      // Add the file to gallery files array
      setGalleryFiles((prev) => [...prev, file]);

      // Simulate success
      setTimeout(() => {
        onSuccess("ok");
      }, 500);
    } catch (error) {
      console.error("Error uploading image:", error);
      message.error("Tải ảnh lên thất bại!");
    }
  };

  // Handle form field changes
  const handleFieldChange = (field, value) => {
    setSportCenter((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      // Create FormData object for file uploads
      const formData = new FormData();

      // Add all the text fields
      formData.append("name", values.name || sportCenter.name);
      formData.append(
        "phoneNumber",
        values.phoneNumber || sportCenter.phoneNumber
      );
      formData.append(
        "addressLine",
        values.addressLine || sportCenter.addressLine
      );
      formData.append("city", values.city || sportCenter.city);
      formData.append("district", values.district || sportCenter.district);
      formData.append("commune", values.commune || sportCenter.commune);
      formData.append(
        "description",
        values.description || sportCenter.description
      );

      // Add avatar file if it exists
      if (avatarFile) {
        formData.append("avatarImage", avatarFile);
      }

      // Add gallery files if they exist
      if (galleryFiles.length > 0) {
        galleryFiles.forEach((file) => {
          formData.append("galleryImages", file);
        });
      }

      // Make API call to create sport center
      const client = new Client();
      const response = await client.createSportCenter(formData);

      console.log("🎯 Venue Data Submitted:", response);
      message.success("Venue created successfully!");

      // Redirect after successful submission
      navigate("/court-owner/venues");
    } catch (error) {
      console.error("Error creating sport center:", error);
      message.error("Gặp lỗi trong quá trình tạo trung tâm thể thao. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title={
        <div className="flex items-center">
          <Button
            type="link"
            icon={<LeftOutlined />}
            onClick={() => navigate("/court-owner/venues")}
            className="mr-2"
          >
            Quay trở lại
          </Button>
        </div>
      }
    >
      <div className="font-semibold text-2xl mb-4">Thiết lập trung tâm thể thao mới</div>

      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        initialValues={sportCenter}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="Tên trung tâm thể thao"
              name="name"
              rules={[{ required: true, message: "Vui lòng nhập tên trung tâm thể thao" }]}
            >
              <Input
                placeholder="Nhập tên trung tâm thể thao"
                onChange={(e) => handleFieldChange("name", e.target.value)}
              />
            </Form.Item>

            <Form.Item
              label="Số điện thoại"
              name="phoneNumber"
              rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
            >
              <Input
                placeholder="Nhập số điện thoại"
                onChange={(e) =>
                  handleFieldChange("phoneNumber", e.target.value)
                }
              />
            </Form.Item>

            <Form.Item
              label="Địa chỉ"
              name="addressLine"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
            >
              <Input
                placeholder="Nhập địa chỉ"
                onChange={(e) =>
                  handleFieldChange("addressLine", e.target.value)
                }
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  label="Tỉnh/Thành phố"
                  name="city"
                  rules={[{ required: true, message: "Required" }]}
                >
                  <Input
                    placeholder="Tỉnh/Thành phố"
                    onChange={(e) => handleFieldChange("city", e.target.value)}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Quận/Huyện"
                  name="district"
                  rules={[{ required: true, message: "Required" }]}
                >
                  <Input
                    placeholder="Quận/Huyện"
                    onChange={(e) =>
                      handleFieldChange("district", e.target.value)
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Xã/Phường"
                  name="commune"
                  rules={[{ required: true, message: "Required" }]}
                >
                  <Input
                    placeholder="Xã/Phường"
                    onChange={(e) =>
                      handleFieldChange("commune", e.target.value)
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>

          <Col span={12}>
            <Form.Item label="Thông tin mô tả" name="description">
              <Input.TextArea
                rows={4}
                placeholder="Mô tả thông tin trung tâm thể thao"
                onChange={(e) =>
                  handleFieldChange("description", e.target.value)
                }
              />
            </Form.Item>

            <Form.Item
              label={<span>Logo trung tâm thể thao <span style={{color: "red"}}>(Bắt buộc)</span></span>}
              name="avatarImage"
              rules={[
                { required: true, message: "Vui lòng tải lên logo trung tâm thể thao" },
              ]}
            >
              <Upload
                listType="picture-card"
                fileList={
                  avatarFile
                    ? [
                        {
                          uid: "-1",
                          name: avatarFile.name,
                          status: "done",
                          url: URL.createObjectURL(avatarFile),
                        },
                      ]
                    : []
                }
                customRequest={customAvatarUpload}
                onRemove={() => setAvatarFile(null)}
                maxCount={1}
              >
                {!avatarFile && (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Tải lên Logo</div>
                  </div>
                )}
              </Upload>
            </Form.Item>

            <Form.Item label="Hình ảnh trung tâm thể thao (Tối đa 5 ảnh)" name="galleryImages">
              <Upload
                listType="picture-card"
                fileList={galleryFiles.map((file, index) => ({
                  uid: index,
                  name: file.name,
                  status: "done",
                  url: URL.createObjectURL(file),
                }))}
                customRequest={customGalleryUpload}
                onRemove={(file) => {
                  const index = galleryFiles.findIndex(
                    (f) => f.uid === file.uid
                  );
                  const newGalleryFiles = [...galleryFiles];
                  newGalleryFiles.splice(index, 1);
                  setGalleryFiles(newGalleryFiles);
                }}
              >
                {galleryFiles.length >= 5 ? null : (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Tải lên</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        {/* You can keep these existing components if needed */}
        {/* <VenueSportsAmenitiesForm />
        <VenueOperatingHoursForm />
        <VenuePricingForm />
        <VenueBookingPolicyForm /> */}

        <Form.Item className="flex justify-end">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={loading}
          >
            {loading ? "Đang tạo..." : "Tạo mới"}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CourtOwnerVenueCreateView;

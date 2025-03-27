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
      message.error("Failed to upload logo");
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
      message.error("Failed to upload image");
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
      message.error("Failed to create venue. Please try again.");
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
            Back to Venue List
          </Button>
        </div>
      }
    >
      <div className="font-semibold text-2xl mb-4">Create New Venue</div>

      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        initialValues={sportCenter}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="Venue Name"
              name="name"
              rules={[{ required: true, message: "Please enter venue name" }]}
            >
              <Input
                placeholder="Enter venue name"
                onChange={(e) => handleFieldChange("name", e.target.value)}
              />
            </Form.Item>

            <Form.Item
              label="Phone Number"
              name="phoneNumber"
              rules={[{ required: true, message: "Please enter phone number" }]}
            >
              <Input
                placeholder="Enter phone number"
                onChange={(e) =>
                  handleFieldChange("phoneNumber", e.target.value)
                }
              />
            </Form.Item>

            <Form.Item
              label="Address"
              name="addressLine"
              rules={[{ required: true, message: "Please enter address" }]}
            >
              <Input
                placeholder="Enter full address"
                onChange={(e) =>
                  handleFieldChange("addressLine", e.target.value)
                }
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  label="City"
                  name="city"
                  rules={[{ required: true, message: "Required" }]}
                >
                  <Input
                    placeholder="City"
                    onChange={(e) => handleFieldChange("city", e.target.value)}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="District"
                  name="district"
                  rules={[{ required: true, message: "Required" }]}
                >
                  <Input
                    placeholder="District"
                    onChange={(e) =>
                      handleFieldChange("district", e.target.value)
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Commune"
                  name="commune"
                  rules={[{ required: true, message: "Required" }]}
                >
                  <Input
                    placeholder="Commune"
                    onChange={(e) =>
                      handleFieldChange("commune", e.target.value)
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>

          <Col span={12}>
            <Form.Item label="Description" name="description">
              <Input.TextArea
                rows={4}
                placeholder="Describe your venue"
                onChange={(e) =>
                  handleFieldChange("description", e.target.value)
                }
              />
            </Form.Item>

            <Form.Item
              label="Venue Logo (Required)"
              name="avatarImage"
              rules={[
                { required: true, message: "Please upload a venue logo" },
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
                    <div style={{ marginTop: 8 }}>Upload Logo</div>
                  </div>
                )}
              </Upload>
            </Form.Item>

            <Form.Item label="Venue Images (Max 5)" name="galleryImages">
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
                    <div style={{ marginTop: 8 }}>Upload</div>
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
            {loading ? "Creating..." : "Create Venue"}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CourtOwnerVenueCreateView;

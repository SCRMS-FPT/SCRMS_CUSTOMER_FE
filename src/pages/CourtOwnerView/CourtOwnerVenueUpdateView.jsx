import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Card,
  message,
  Spin,
  Row,
  Col,
  Typography,
  Divider,
  Space,
  Upload,
  Modal,
  Switch,
  Tooltip,
} from "antd";
import {
  LeftOutlined,
  SaveOutlined,
  UploadOutlined,
  PictureOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Client } from "@/API/CourtApi";
import { motion } from "framer-motion";

const { Title, Text } = Typography;
const { TextArea } = Input;

const CourtOwnerVenueUpdateView = () => {
  const { venueId } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [venue, setVenue] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [keepExistingAvatar, setKeepExistingAvatar] = useState(true);
  const [keepExistingGallery, setKeepExistingGallery] = useState(true);
  const [fileList, setFileList] = useState([]);

  const client = new Client();

  useEffect(() => {
    const fetchVenueData = async () => {
      try {
        setLoading(true);
        const venueData = await client.getSportCenterById(venueId);
        console.log("Sport center data:", venueData);
        setVenue(venueData);

        // Set form values
        form.setFieldsValue({
          name: venueData.name,
          phoneNumber: venueData.phoneNumber,
          addressLine: venueData.addressLine?.split(",")[0] || "",
          city: venueData.city?.split(",").pop()?.trim() || "",
          description: venueData.description,
          district: venueData.district || "",
          commune: venueData.commune || "",
          latitude: venueData.latitude || 0,
          longitude: venueData.longitude || 0,
        });

        // Set existing gallery files for display
        if (venueData.imageUrl && venueData.imageUrl.length > 0) {
          const fileList = venueData.imageUrl.map((url, index) => ({
            uid: `-${index + 1}`,
            name: `Image ${index + 1}`,
            status: "done",
            url: url,
            thumbUrl: url,
            isExisting: true,
          }));
          setFileList(fileList);
        }
      } catch (error) {
        console.error("Error fetching sport center data:", error);
        message.error("Failed to load sport center data");
      } finally {
        setLoading(false);
      }
    };

    if (venueId) {
      fetchVenueData();
    }
  }, [venueId, form]);

  const onFinish = async (values) => {
    try {
      setSubmitLoading(true);

      // Create FormData object
      const formData = new FormData();

      // Add basic venue information
      formData.append("Name", values.name);
      formData.append("PhoneNumber", values.phoneNumber);
      formData.append("AddressLine", values.addressLine);
      formData.append("City", values.city);
      formData.append("District", values.district || "");
      formData.append("Commune", values.commune || "");
      formData.append("Latitude", values.latitude || 0);
      formData.append("Longitude", values.longitude || 0);
      formData.append("Description", values.description || "");

      // Add avatar handling
      formData.append("KeepExistingAvatar", keepExistingAvatar);
      if (venue.avatar) {
        formData.append("ExistingAvatar", venue.avatar);
      }
      if (avatarFile && !keepExistingAvatar) {
        formData.append("AvatarImage", avatarFile);
      }

      // Add gallery handling
      formData.append("KeepExistingGallery", keepExistingGallery);
      if (venue.imageUrl && venue.imageUrl.length > 0) {
        venue.imageUrl.forEach((url) => {
          formData.append("ExistingGalleryUrls", url);
        });
      }

      // Add new gallery files if any
      if (!keepExistingGallery && galleryFiles.length > 0) {
        galleryFiles.forEach((file) => {
          formData.append("GalleryImages", file);
        });
      }

      // Make the API call to update the sport center
      const response = await client.updateSportCenter(venueId, formData);

      if (response) {
        message.success("Sport center updated successfully!");
        navigate(`/court-owner/venues/${venueId}`);
      } else {
        throw new Error("Failed to update sport center");
      }
    } catch (error) {
      console.error("Error updating sport center:", error);
      message.error(
        "Failed to update sport center: " + (error.message || "Unknown error")
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  // Custom upload handler for avatar
  const customAvatarUpload = async ({ file, onSuccess }) => {
    try {
      // Store the file in state
      setAvatarFile(file);
      setKeepExistingAvatar(false);

      // Simulate success
      setTimeout(() => {
        onSuccess("ok");
      }, 500);
    } catch (error) {
      console.error("Error uploading avatar:", error);
      message.error("Failed to upload avatar");
    }
  };

  // Handle gallery uploads
  const handleGalleryChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);

    // Extract only new files for upload (not existing URLs)
    const newFiles = newFileList
      .filter((file) => file.originFileObj)
      .map((file) => file.originFileObj);

    setGalleryFiles(newFiles);

    if (newFiles.length > 0 || newFileList.length !== venue?.imageUrl?.length) {
      setKeepExistingGallery(false);
    }
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        title={
          <div style={{ display: "flex", alignItems: "center" }}>
            <Button
              type="link"
              icon={<LeftOutlined />}
              onClick={() => navigate(`/court-owner/venues/${venueId}`)}
              style={{ marginRight: 16 }}
            >
              Back
            </Button>
            <Title level={4} style={{ margin: 0 }}>
              Update Sport Center
            </Title>
          </div>
        }
        extra={
          <Space>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              loading={submitLoading}
              onClick={() => form.submit()}
            >
              Save Changes
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            latitude: 0,
            longitude: 0,
          }}
        >
          <Row gutter={24}>
            <Col span={24}>
              <Card title="Basic Information" bordered={false}>
                <Row gutter={24}>
                  <Col span={24} md={12}>
                    <Form.Item
                      name="name"
                      label="Sport Center Name"
                      rules={[
                        {
                          required: true,
                          message: "Please enter the sport center name",
                        },
                      ]}
                    >
                      <Input placeholder="Enter sport center name" />
                    </Form.Item>
                  </Col>

                  <Col span={24} md={12}>
                    <Form.Item
                      name="phoneNumber"
                      label={
                        <span>
                          <PhoneOutlined /> Phone Number
                        </span>
                      }
                      rules={[
                        {
                          required: true,
                          message: "Please enter phone number",
                        },
                      ]}
                    >
                      <Input placeholder="Enter phone number" />
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <Form.Item
                      name="description"
                      label={
                        <span>
                          <InfoCircleOutlined /> Description
                        </span>
                      }
                    >
                      <TextArea
                        rows={4}
                        placeholder="Enter a detailed description of your sport center"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Col>

            <Col span={24} style={{ marginTop: 24 }}>
              <Card
                title={
                  <span>
                    <EnvironmentOutlined /> Location
                  </span>
                }
                bordered={false}
              >
                <Row gutter={24}>
                  <Col span={24} md={12}>
                    <Form.Item
                      name="addressLine"
                      label="Address Line"
                      rules={[
                        { required: true, message: "Please enter address" },
                      ]}
                    >
                      <Input placeholder="Street address" />
                    </Form.Item>
                  </Col>

                  <Col span={24} md={12}>
                    <Form.Item
                      name="city"
                      label="City"
                      rules={[{ required: true, message: "Please enter city" }]}
                    >
                      <Input placeholder="City" />
                    </Form.Item>
                  </Col>

                  <Col span={12} md={6}>
                    <Form.Item name="district" label="District">
                      <Input placeholder="District (optional)" />
                    </Form.Item>
                  </Col>

                  <Col span={12} md={6}>
                    <Form.Item name="commune" label="Commune/Ward">
                      <Input placeholder="Commune or Ward (optional)" />
                    </Form.Item>
                  </Col>

                  <Col span={12} md={6}>
                    <Form.Item
                      name="latitude"
                      label={
                        <span>
                          Latitude
                          <Tooltip title="Optional: coordinates for map display">
                            <QuestionCircleOutlined style={{ marginLeft: 4 }} />
                          </Tooltip>
                        </span>
                      }
                    >
                      <Input type="number" placeholder="Latitude" />
                    </Form.Item>
                  </Col>

                  <Col span={12} md={6}>
                    <Form.Item
                      name="longitude"
                      label={
                        <span>
                          Longitude
                          <Tooltip title="Optional: coordinates for map display">
                            <QuestionCircleOutlined style={{ marginLeft: 4 }} />
                          </Tooltip>
                        </span>
                      }
                    >
                      <Input type="number" placeholder="Longitude" />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Col>

            <Col span={24} style={{ marginTop: 24 }}>
              <Card
                title={
                  <span>
                    <PictureOutlined /> Images
                  </span>
                }
                bordered={false}
              >
                <Row gutter={[24, 24]}>
                  <Col span={24} md={12}>
                    <Title level={5}>Sport Center Avatar</Title>

                    {venue.avatar && (
                      <div style={{ marginBottom: 16 }}>
                        <img
                          src={venue.avatar}
                          alt="Current avatar"
                          style={{
                            width: "100%",
                            maxWidth: 300,
                            borderRadius: 4,
                          }}
                        />
                        <div style={{ marginTop: 8 }}>
                          <Text type="secondary">Current avatar</Text>
                          <Switch
                            checked={keepExistingAvatar}
                            onChange={setKeepExistingAvatar}
                            checkedChildren="Keep"
                            unCheckedChildren="Replace"
                            style={{ marginLeft: 16 }}
                          />
                        </div>
                      </div>
                    )}

                    <Upload
                      name="avatarImage"
                      listType="picture-card"
                      showUploadList={!keepExistingAvatar && !!avatarFile}
                      fileList={
                        !keepExistingAvatar && avatarFile
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
                      onRemove={() => {
                        setAvatarFile(null);
                        setKeepExistingAvatar(false);
                      }}
                      disabled={keepExistingAvatar && venue.avatar}
                      maxCount={1}
                    >
                      {(!keepExistingAvatar || !venue.avatar) &&
                        !avatarFile && (
                          <div>
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>
                              {keepExistingAvatar && venue.avatar
                                ? "Avatar Upload (Disabled)"
                                : "Upload New Avatar"}
                            </div>
                          </div>
                        )}
                    </Upload>
                  </Col>

                  <Col span={24} md={12}>
                    <Title level={5}>Gallery Images</Title>

                    {venue.imageUrl && venue.imageUrl.length > 0 && (
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ marginTop: 8 }}>
                          <Text type="secondary">Current gallery images</Text>
                          <Switch
                            checked={keepExistingGallery}
                            onChange={(checked) => {
                              setKeepExistingGallery(checked);
                              if (checked) {
                                // Reset to original gallery
                                setFileList(
                                  venue.imageUrl.map((url, index) => ({
                                    uid: `-${index + 1}`,
                                    name: `Image ${index + 1}`,
                                    status: "done",
                                    url: url,
                                    thumbUrl: url,
                                    isExisting: true,
                                  }))
                                );
                                setGalleryFiles([]);
                              } else {
                                // Start with empty gallery if not keeping existing
                                setFileList([]);
                                setGalleryFiles([]);
                              }
                            }}
                            checkedChildren="Keep All"
                            unCheckedChildren="Modify"
                            style={{ marginLeft: 16 }}
                          />
                        </div>
                      </div>
                    )}

                    <Upload
                      listType="picture-card"
                      fileList={fileList}
                      onPreview={handlePreview}
                      onChange={handleGalleryChange}
                      beforeUpload={() => false}
                      disabled={
                        keepExistingGallery &&
                        venue.imageUrl &&
                        venue.imageUrl.length > 0
                      }
                      multiple
                    >
                      {keepExistingGallery &&
                      venue.imageUrl &&
                      venue.imageUrl.length > 0 ? (
                        <div>
                          <div style={{ marginTop: 8 }}>
                            Gallery Upload (Disabled)
                          </div>
                        </div>
                      ) : fileList.length >= 5 ? null : (
                        <div>
                          <PlusOutlined />
                          <div style={{ marginTop: 8 }}>Upload</div>
                        </div>
                      )}
                    </Upload>
                    <Text type="secondary">
                      Upload multiple gallery images of your sport center (max
                      5)
                    </Text>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>

          <Divider />

          <Row justify="space-between">
            <Col>
              <Button
                onClick={() => navigate(`/court-owner/venues/${venueId}`)}
              >
                Cancel
              </Button>
            </Col>
            <Col>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submitLoading}
                  icon={<SaveOutlined />}
                >
                  Save Changes
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      <Modal
        open={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="Preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </motion.div>
  );
};

export default CourtOwnerVenueUpdateView;

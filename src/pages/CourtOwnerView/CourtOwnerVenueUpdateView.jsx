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
import { LocationApi } from "@/API/LocationApi";
import { motion } from "framer-motion";
import LocationPicker from "@/components/GeneralComponents/LocationPicker";

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

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [locationLoading, setLocationLoading] = useState({
    provinces: false,
    districts: false,
    communes: false,
  });
  const [selectedLocationIds, setSelectedLocationIds] = useState({
    provinceId: "",
    districtId: "",
    communeId: "",
  });

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
        if (venueData.imageUrls && venueData.imageUrls.length > 0) {
          const fileList = venueData.imageUrls.map((url, index) => ({
            uid: `-${index + 1}`,
            name: `Image ${index + 1}`,
            status: "done",
            url: url,
            thumbUrl: url,
            isExisting: true,
          }));
          setFileList(fileList);
        }

        // Load provinces for location selectors
        loadProvinces();
      } catch (error) {
        console.error("Error fetching sport center data:", error);
        message.error("Truy xuất thông tin trung tâm thể thao thất bại");
      } finally {
        setLoading(false);
      }
    };

    if (venueId) {
      fetchVenueData();
    }
  }, [venueId, form]);

  const loadProvinces = async () => {
    try {
      setLocationLoading((prev) => ({ ...prev, provinces: true }));
      const provincesData = await LocationApi.getProvinces();
      setProvinces(provincesData);
    } catch (error) {
      console.error("Error loading provinces:", error);
    } finally {
      setLocationLoading((prev) => ({ ...prev, provinces: false }));
    }
  };

  const loadDistricts = async (provinceId) => {
    if (!provinceId) {
      setDistricts([]);
      return;
    }
    try {
      setLocationLoading((prev) => ({ ...prev, districts: true }));
      const districtsData = await LocationApi.getDistricts(provinceId);
      setDistricts(districtsData);
    } catch (error) {
      console.error("Error loading districts:", error);
    } finally {
      setLocationLoading((prev) => ({ ...prev, districts: false }));
    }
  };

  const loadCommunes = async (districtId) => {
    if (!districtId) {
      setCommunes([]);
      return;
    }
    try {
      setLocationLoading((prev) => ({ ...prev, communes: true }));
      const communesData = await LocationApi.getCommunes(districtId);
      setCommunes(communesData);
    } catch (error) {
      console.error("Error loading communes:", error);
    } finally {
      setLocationLoading((prev) => ({ ...prev, communes: false }));
    }
  };

  const handleProvinceChange = (provinceId, provinceName) => {
    setSelectedLocationIds((prev) => ({
      ...prev,
      provinceId,
      districtId: "",
      communeId: "",
    }));
    form.setFieldsValue({ city: provinceName, district: "", commune: "" });
    loadDistricts(provinceId);
  };

  const handleDistrictChange = (districtId, districtName) => {
    setSelectedLocationIds((prev) => ({
      ...prev,
      districtId,
      communeId: "",
    }));
    form.setFieldsValue({ district: districtName, commune: "" });
    loadCommunes(districtId);
  };

  const handleCommuneChange = (communeId, communeName) => {
    setSelectedLocationIds((prev) => ({
      ...prev,
      communeId,
    }));
    form.setFieldsValue({ commune: communeName });
  };

  const handleLocationChange = (lat, lng) => {
    form.setFieldsValue({
      latitude: lat,
      longitude: lng,
    });
  };

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

      // If we're not keeping all existing gallery images as-is, include only the ones we want to keep
      if (!keepExistingGallery) {
        // Find existing images that are still in the file list
        const keptExistingImages = fileList
          .filter((file) => file.isExisting && file.url)
          .map((file) => file.url);

        // Add each kept existing image URL
        if (keptExistingImages.length > 0) {
          keptExistingImages.forEach((url) => {
            formData.append("ExistingGalleryUrls", url);
          });
        } else {
          // If all existing images were removed, send an empty array indicator
          formData.append("ExistingGalleryUrls", "");
        }
      }
      // If keeping all existing gallery
      else if (venue.imageUrls && venue.imageUrls.length > 0) {
        venue.imageUrls.forEach((url) => {
          formData.append("ExistingGalleryUrls", url);
        });
      }

      // Add new gallery files if any
      if (galleryFiles.length > 0) {
        galleryFiles.forEach((file) => {
          formData.append("GalleryImages", file);
        });
      }

      // Make the API call to update the sport center
      const response = await client.updateSportCenter(venueId, formData);

      if (response) {
        message.success(
          "Thông tin trung tâm thể thao được cập nhật thành công!"
        );
        navigate(`/court-owner/venues/${venueId}`);
      } else {
        throw new Error("Failed to update sport center");
      }
    } catch (error) {
      console.error("Error updating sport center:", error);
      message.error(
        "Gặp lỗi trong quá trình cập nhật thông tin trung tâm thể thao: " +
          (error.message || "Unknown error")
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const customAvatarUpload = async ({ file, onSuccess }) => {
    try {
      setAvatarFile(file);
      setKeepExistingAvatar(false);

      setTimeout(() => {
        onSuccess("ok");
      }, 500);
    } catch (error) {
      console.error("Error uploading avatar:", error);
      message.error("Lỗi trong quá trình cập nhật ảnh đại diện!");
    }
  };

  const handleGalleryChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);

    const newFiles = newFileList
      .filter((file) => file.originFileObj)
      .map((file) => file.originFileObj);

    setGalleryFiles(newFiles);

    // When a user removes or adds images, we need to track changes
    // Check if the original set of images has changed
    if (venue.imageUrls && venue.imageUrls.length > 0) {
      const keepingAllOriginal = venue.imageUrls.every((url) =>
        newFileList.some((file) => file.url === url && file.isExisting)
      );

      // If not keeping all original images, set keepExistingGallery to false
      if (!keepingAllOriginal) {
        setKeepExistingGallery(false);
      }
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
              Quay lại
            </Button>
            <Title level={4} style={{ margin: 0 }}>
              Cập nhật thông tin trung tâm thể thao
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
              Lưu thay đổi
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
              <Card title="Thông tin cơ bản" bordered={false}>
                <Row gutter={24}>
                  <Col span={24} md={12}>
                    <Form.Item
                      name="name"
                      label="Tên trung tâm thể thao"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng điền tên trung tâm thể thao",
                        },
                      ]}
                    >
                      <Input placeholder="Nhập tên trung tâm thể thao" />
                    </Form.Item>
                  </Col>

                  <Col span={24} md={12}>
                    <Form.Item
                      name="phoneNumber"
                      label={
                        <span>
                          <PhoneOutlined /> Số điện thoại
                        </span>
                      }
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng điền số điện thoại",
                        },
                      ]}
                    >
                      <Input placeholder="Nhập số điện thoại" />
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <Form.Item
                      name="description"
                      label={
                        <span>
                          <InfoCircleOutlined /> Thông tin mô tả
                        </span>
                      }
                    >
                      <TextArea
                        rows={4}
                        placeholder="Nhập thông tin mô tả về trung tâm thể thao"
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
                    <EnvironmentOutlined /> Địa chỉ
                  </span>
                }
                bordered={false}
              >
                <Row gutter={24}>
                  <Col span={24} md={12}>
                    <Form.Item
                      name="addressLine"
                      label="Địa chỉ"
                      rules={[
                        { required: true, message: "Vui lòng nhập địa chỉ" },
                      ]}
                    >
                      <Input placeholder="Street address" />
                    </Form.Item>
                  </Col>

                  <Col span={24} md={12}>
                    <Form.Item
                      name="city"
                      label="Tỉnh/Thành phố"
                      rules={[
                        { required: true, message: "Nhập tên tỉnh/thành phố" },
                      ]}
                    >
                      <Input placeholder="City" />
                    </Form.Item>
                  </Col>

                  <Col span={12} md={6}>
                    <Form.Item name="district" label="Quận/Huyện">
                      <Input placeholder="Quận/Huyện (tùy chọn)" />
                    </Form.Item>
                  </Col>

                  <Col span={12} md={6}>
                    <Form.Item name="commune" label="Xã/Huyện">
                      <Input placeholder="Xã/Huyện (tùy chọn)" />
                    </Form.Item>
                  </Col>

                  <Col span={12} md={6}>
                    <Form.Item
                      name="latitude"
                      label={
                        <span>
                          Vĩ độ
                          <Tooltip title="Optional: coordinates for map display">
                            <QuestionCircleOutlined style={{ marginLeft: 4 }} />
                          </Tooltip>
                        </span>
                      }
                    >
                      <Input type="number" placeholder="Vĩ độ" />
                    </Form.Item>
                  </Col>

                  <Col span={12} md={6}>
                    <Form.Item
                      name="longitude"
                      label={
                        <span>
                          Kinh độ
                          <Tooltip title="Optional: coordinates for map display">
                            <QuestionCircleOutlined style={{ marginLeft: 4 }} />
                          </Tooltip>
                        </span>
                      }
                    >
                      <Input type="number" placeholder="Kinh độ" />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Col>

            <Col span={24} style={{ marginTop: 24 }}>
              <LocationPicker
                latitude={form.getFieldValue("latitude")}
                longitude={form.getFieldValue("longitude")}
                onLocationChange={handleLocationChange}
                address={`${form.getFieldValue(
                  "addressLine"
                )}, ${form.getFieldValue("district")}, ${form.getFieldValue(
                  "commune"
                )}, ${form.getFieldValue("city")}`}
              />
            </Col>

            <Col span={24} style={{ marginTop: 24 }}>
              <Card
                title={
                  <span>
                    <PictureOutlined /> Hình ảnh trung tâm thể thao
                  </span>
                }
                bordered={false}
              >
                <Row gutter={[24, 24]}>
                  <Col span={24} md={12}>
                    <Title level={5}>Ảnh đại diện trung tâm thể thao</Title>

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
                          <Text type="secondary">Ảnh đại diện hiện tại</Text>
                          <Switch
                            checked={keepExistingAvatar}
                            onChange={setKeepExistingAvatar}
                            checkedChildren="Giữ"
                            unCheckedChildren="Thay thế"
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
                                : "Tải ảnh"}
                            </div>
                          </div>
                        )}
                    </Upload>
                  </Col>

                  <Col span={24} md={12}>
                    <Title level={5}>Hình ảnh</Title>

                    {venue.imageUrls && venue.imageUrls.length > 0 && (
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ marginTop: 8 }}>
                          <Text type="secondary">Hình ảnh hiện tại</Text>
                          <Switch
                            checked={keepExistingGallery}
                            onChange={(checked) => {
                              setKeepExistingGallery(checked);
                              if (checked) {
                                // Reset to original gallery
                                setFileList(
                                  venue.imageUrls.map((url, index) => ({
                                    uid: `-${index + 1}`,
                                    name: `Image ${index + 1}`,
                                    status: "done",
                                    url: url,
                                    thumbUrl: url,
                                    isExisting: true,
                                  }))
                                );
                                setGalleryFiles([]);
                              }
                              // Don't clear the file list when unchecked
                              // This allows the user to selectively remove images
                            }}
                            checkedChildren="Giữ tất cả"
                            unCheckedChildren="Chỉnh sửa"
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
                      disabled={keepExistingGallery}
                      multiple
                      onRemove={(file) => {
                        // Allow removal of images even if they're existing ones
                        const newFileList = fileList.filter(
                          (item) => item.uid !== file.uid
                        );
                        setFileList(newFileList);

                        // If we've removed an existing image, we're not keeping all existing gallery
                        if (file.isExisting) {
                          setKeepExistingGallery(false);
                        }

                        // Update galleryFiles array for new files
                        const newGalleryFiles = galleryFiles.filter(
                          (item) =>
                            !newFileList.some((f) => f.originFileObj === item)
                        );
                        setGalleryFiles(newGalleryFiles);

                        return true; // Allow the removal
                      }}
                    >
                      {keepExistingGallery ? null : fileList.length >=
                        5 ? null : (
                        <div>
                          <PlusOutlined />
                          <div style={{ marginTop: 8 }}>Tải lên</div>
                        </div>
                      )}
                    </Upload>
                    <Text type="secondary">
                      Tải lên nhiều ảnh của trung tâm thể thao của bạn (tối đa 5
                      ảnh). Bạn có thể xóa ảnh đã có bằng cách nhấp vào nút xóa
                      trên ảnh.
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
                Hủy
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
                  Lưu thay đổi
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

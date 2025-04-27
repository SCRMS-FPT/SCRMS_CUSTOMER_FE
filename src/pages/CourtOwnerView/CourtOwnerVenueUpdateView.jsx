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
  Table,
  Select,
  Tag,
  Empty,
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
const { Option } = Select;

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
  const [courts, setCourts] = useState([]);
  const [courtStatusUpdates, setCourtStatusUpdates] = useState({});
  const [courtsLoading, setCourtsLoading] = useState(false);

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

        form.setFieldsValue({
          name: venueData.name,
          phoneNumber: venueData.phoneNumber,
          addressLine: venueData.addressLine?.split(",")[0] || "",
          description: venueData.description,
          latitude: venueData.latitude || 0,
          longitude: venueData.longitude || 0,
        });

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

        loadProvinces();

        const cityName = venueData.city?.split(",").pop()?.trim() || "";
        if (cityName) {
          form.setFieldsValue({ city: cityName });
        }

        form.setFieldsValue({
          district: venueData.district || "",
          commune: venueData.commune || "",
        });

        await fetchCourts(venueId);
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

  useEffect(() => {
    if (provinces.length > 0 && venue && venue.city) {
      const cityName = venue.city?.split(",").pop()?.trim() || "";
      const matchedProvince = provinces.find(
        (p) => p.name.toLowerCase() === cityName.toLowerCase()
      );

      if (matchedProvince) {
        setSelectedLocationIds((prev) => ({
          ...prev,
          provinceId: matchedProvince.id,
        }));
        loadDistricts(matchedProvince.id);
      }
    }
  }, [provinces, venue]);

  useEffect(() => {
    if (districts.length > 0 && venue && venue.district) {
      const districtName = venue.district;
      const matchedDistrict = districts.find(
        (d) => d.name.toLowerCase() === districtName.toLowerCase()
      );

      if (matchedDistrict) {
        setSelectedLocationIds((prev) => ({
          ...prev,
          districtId: matchedDistrict.id,
        }));
        loadCommunes(matchedDistrict.id);
      }
    }
  }, [districts, venue]);

  useEffect(() => {
    if (communes.length > 0 && venue && venue.commune) {
      const communeName = venue.commune;
      const matchedCommune = communes.find(
        (c) => c.name.toLowerCase() === communeName.toLowerCase()
      );

      if (matchedCommune) {
        setSelectedLocationIds((prev) => ({
          ...prev,
          communeId: matchedCommune.id,
        }));
      }
    }
  }, [communes, venue]);

  const fetchCourts = async (sportCenterId) => {
    try {
      setCourtsLoading(true);
      const response = await client.getAllCourtsOfSportCenter(sportCenterId);
      if (response && response.courts) {
        setCourts(response.courts);

        const statusMap = {};
        response.courts.forEach((court) => {
          statusMap[court.id] = court.status;
        });
        setCourtStatusUpdates(statusMap);
      }
    } catch (error) {
      console.error("Error fetching courts:", error);
      message.error("Không thể tải danh sách sân");
    } finally {
      setCourtsLoading(false);
    }
  };

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

  const handleCourtStatusChange = (courtId, newStatus) => {
    setCourtStatusUpdates((prev) => ({
      ...prev,
      [courtId]: newStatus,
    }));
  };

  const updateCourtStatus = async (courtId, newStatus) => {
    try {
      const courtDetails = await client.getCourtDetails(courtId);
      if (!courtDetails || !courtDetails.court) {
        throw new Error("Could not fetch court details");
      }

      const courtData = courtDetails.court;
      const updateData = {
        court: {
          courtName: courtData.courtName,
          sportId: courtData.sportId,
          description: courtData.description,
          facilities: courtData.facilities,
          slotDuration: courtData.slotDuration,
          status: parseInt(newStatus),
          courtType: courtData.courtType,
          minDepositPercentage: courtData.minDepositPercentage,
          cancellationWindowHours: courtData.cancellationWindowHours,
          refundPercentage: courtData.refundPercentage,
        },
      };

      const response = await client.updateCourt(courtId, updateData);
      if (!response || !response.isSuccess) {
        throw new Error("API returned unsuccessful status");
      }
      return true;
    } catch (error) {
      console.error(`Error updating court ${courtId} status:`, error);
      return false;
    }
  };

  const onFinish = async (values) => {
    try {
      setSubmitLoading(true);

      const formData = new FormData();

      formData.append("Name", values.name);
      formData.append("PhoneNumber", values.phoneNumber);
      formData.append("AddressLine", values.addressLine);
      formData.append("City", values.city);
      formData.append("District", values.district || "");
      formData.append("Commune", values.commune || "");
      formData.append("Latitude", values.latitude || 0);
      formData.append("Longitude", values.longitude || 0);
      formData.append("Description", values.description || "");

      formData.append("KeepExistingAvatar", keepExistingAvatar);
      if (venue.avatar) {
        formData.append("ExistingAvatar", venue.avatar);
      }
      if (avatarFile && !keepExistingAvatar) {
        formData.append("AvatarImage", avatarFile);
      }

      formData.append("KeepExistingGallery", keepExistingGallery);

      if (!keepExistingGallery) {
        const keptExistingImages = fileList
          .filter((file) => file.isExisting && file.url)
          .map((file) => file.url);

        if (keptExistingImages.length > 0) {
          keptExistingImages.forEach((url) => {
            formData.append("ExistingGalleryUrls", url);
          });
        } else {
          formData.append("ExistingGalleryUrls", "");
        }
      } else if (venue.imageUrls && venue.imageUrls.length > 0) {
        venue.imageUrls.forEach((url) => {
          formData.append("ExistingGalleryUrls", url);
        });
      }

      if (galleryFiles.length > 0) {
        galleryFiles.forEach((file) => {
          formData.append("GalleryImages", file);
        });
      }

      const response = await client.updateSportCenter(venueId, formData);

      if (response) {
        if (Object.keys(courtStatusUpdates).length > 0) {
          message.info("Đang cập nhật trạng thái các sân...");

          const courtStatusPromises = [];
          for (const [courtId, newStatus] of Object.entries(
            courtStatusUpdates
          )) {
            const court = courts.find((c) => c.id === courtId);
            if (court && parseInt(court.status) !== parseInt(newStatus)) {
              courtStatusPromises.push(updateCourtStatus(courtId, newStatus));
            }
          }

          if (courtStatusPromises.length > 0) {
            const results = await Promise.all(courtStatusPromises);
            const failedCount = results.filter((result) => !result).length;
            const successCount = results.filter((result) => result).length;

            if (failedCount > 0) {
              message.warning(
                `${failedCount} sân không cập nhật được trạng thái.`
              );
            }

            if (successCount > 0) {
              message.success(
                `${successCount} sân đã được cập nhật trạng thái thành công.`
              );
            }
          }
        }

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

    if (venue.imageUrls && venue.imageUrls.length > 0) {
      const keepingAllOriginal = venue.imageUrls.every((url) =>
        newFileList.some((file) => file.url === url && file.isExisting)
      );

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

  const getCourtStatusTag = (status) => {
    switch (parseInt(status)) {
      case 0:
        return <Tag color="green">Mở</Tag>;
      case 1:
        return <Tag color="red">Đóng cửa</Tag>;
      case 2:
        return <Tag color="orange">Bảo trì</Tag>;
      default:
        return <Tag>Không xác định</Tag>;
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Thêm ảnh</div>
    </div>
  );

  const columns = [
    {
      title: "Tên sân",
      dataIndex: "courtName",
      key: "courtName",
    },
    {
      title: "Loại sân",
      dataIndex: "sportName",
      key: "sportName",
    },
    {
      title: "Trạng thái hiện tại",
      dataIndex: "status",
      key: "currentStatus",
      render: (status) => getCourtStatusTag(status),
    },
    {
      title: "Cập nhật trạng thái",
      key: "updateStatus",
      render: (_, record) => (
        <Select
          defaultValue={record.status}
          style={{ width: 150 }}
          onChange={(value) => handleCourtStatusChange(record.id, value)}
          value={courtStatusUpdates[record.id]}
        >
          <Option value={0}>Mở (Open)</Option>
          <Option value={1}>Đóng cửa (Closed)</Option>
          <Option value={2}>Bảo trì (Maintenance)</Option>
        </Select>
      ),
    },
  ];

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
                  <Col span={24}>
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

                  <Col span={24}>
                    <Row gutter={24}>
                      <Col span={24} md={8}>
                        <Form.Item
                          name="city"
                          label="Tỉnh/Thành phố"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng chọn Tỉnh/Thành phố",
                            },
                          ]}
                        >
                          <Select
                            placeholder="Chọn Tỉnh/Thành phố"
                            loading={locationLoading.provinces}
                            onChange={(value) => {
                              const selectedProvince = provinces.find(
                                (p) => p.id === value
                              );
                              if (selectedProvince) {
                                handleProvinceChange(
                                  selectedProvince.id,
                                  selectedProvince.name
                                );
                              }
                            }}
                            value={selectedLocationIds.provinceId}
                          >
                            {provinces.map((province) => (
                              <Option key={province.id} value={province.id}>
                                {province.name}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>

                      <Col span={24} md={8}>
                        <Form.Item
                          name="district"
                          label="Quận/Huyện"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng chọn Quận/Huyện",
                            },
                          ]}
                        >
                          <Select
                            placeholder="Chọn Quận/Huyện"
                            loading={locationLoading.districts}
                            disabled={!selectedLocationIds.provinceId}
                            onChange={(value) => {
                              const selectedDistrict = districts.find(
                                (d) => d.id === value
                              );
                              if (selectedDistrict) {
                                handleDistrictChange(
                                  selectedDistrict.id,
                                  selectedDistrict.name
                                );
                              }
                            }}
                            value={selectedLocationIds.districtId}
                          >
                            {districts.map((district) => (
                              <Option key={district.id} value={district.id}>
                                {district.name}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>

                      <Col span={24} md={8}>
                        <Form.Item
                          name="commune"
                          label="Xã/Phường"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng chọn Xã/Phường",
                            },
                          ]}
                        >
                          <Select
                            placeholder="Chọn Xã/Phường"
                            loading={locationLoading.communes}
                            disabled={!selectedLocationIds.districtId}
                            onChange={(value) => {
                              const selectedCommune = communes.find(
                                (c) => c.id === value
                              );
                              if (selectedCommune) {
                                handleCommuneChange(
                                  selectedCommune.id,
                                  selectedCommune.name
                                );
                              }
                            }}
                            value={selectedLocationIds.communeId}
                          >
                            {communes.map((commune) => (
                              <Option key={commune.id} value={commune.id}>
                                {commune.name}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card>
            </Col>

            <Col span={24} style={{ marginTop: 24 }}>
              <LocationPicker
                latitude={form.getFieldValue("latitude")}
                longitude={form.getFieldValue("longitude")}
                onLocationChange={(lat, lng) => {
                  form.setFieldsValue({
                    latitude: lat,
                    longitude: lng,
                  });
                }}
                address={`${form.getFieldValue(
                  "addressLine"
                )}, ${form.getFieldValue("district")}, ${form.getFieldValue(
                  "commune"
                )}, ${form.getFieldValue("city")}`}
              />

              {/* Add hidden form items for latitude and longitude */}
              <Form.Item name="latitude" hidden={true}>
                <Input type="hidden" />
              </Form.Item>
              <Form.Item name="longitude" hidden={true}>
                <Input type="hidden" />
              </Form.Item>
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
                      accept="image/*"
                      multiple
                    >
                      {fileList.length >= 8 ? null : uploadButton}
                    </Upload>
                    {fileList.length === 0 && (
                      <div style={{ marginTop: "10px", color: "#999" }}>
                        <InfoCircleOutlined style={{ marginRight: "5px" }} />
                        Chưa có hình ảnh nào. Hãy thêm hình ảnh để thu hút khách
                        hàng!
                      </div>
                    )}
                    <Modal
                      open={previewVisible}
                      title={previewTitle}
                      footer={null}
                      onCancel={() => setPreviewVisible(false)}
                    >
                      <img
                        alt="Preview"
                        style={{ width: "100%" }}
                        src={previewImage}
                      />
                    </Modal>
                  </Col>
                </Row>
              </Card>
            </Col>

            <Col span={24} style={{ marginTop: 24 }}>
              <Card
                title={
                  <span>
                    <InfoCircleOutlined /> Quản lý trạng thái sân
                  </span>
                }
                bordered={false}
              >
                <Spin spinning={courtsLoading}>
                  {courts.length > 0 ? (
                    <Table
                      dataSource={courts}
                      columns={columns}
                      rowKey="id"
                      pagination={false}
                    />
                  ) : (
                    <Empty description="Không có sân nào được tìm thấy" />
                  )}
                </Spin>
                <div style={{ marginTop: 16 }}>
                  <Title level={5}>Giải thích các trạng thái:</Title>
                  <ul>
                    <li>
                      <Text>
                        <Tag color="green">Mở (Open)</Tag> - Sân đang hoạt động
                        và có thể đặt. Khách hàng có thể tìm thấy và đặt sân
                        này.
                      </Text>
                    </li>
                    <li>
                      <Text>
                        <Tag color="red">Đóng cửa (Closed)</Tag> - Sân đóng cửa
                        và không thể đặt. Sân sẽ không xuất hiện trong kết quả
                        tìm kiếm.
                      </Text>
                    </li>
                    <li>
                      <Text>
                        <Tag color="orange">Bảo trì (Maintenance)</Tag> - Sân
                        đang được bảo trì và tạm thời không thể đặt. Sân sẽ xuất
                        hiện nhưng không thể đặt.
                      </Text>
                    </li>
                  </ul>
                </div>
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
    </motion.div>
  );
};

export default CourtOwnerVenueUpdateView;

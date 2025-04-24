import React, { useState, useEffect } from "react";
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
  Select,
} from "antd";
import { useNavigate } from "react-router-dom";
import { LeftOutlined, UploadOutlined, PlusOutlined } from "@ant-design/icons";
import { Client } from "@/API/CourtApi";
import { LocationApi } from "@/API/LocationApi";
import LocationPicker from "@/components/GeneralComponents/LocationPicker";

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
    latitude: 0,
    longitude: 0,
  });

  // State for location data
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

    loadProvinces();
  }, []);

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
    handleFieldChange("city", provinceName);
    loadDistricts(provinceId);
    setCommunes([]);
  };

  const handleDistrictChange = (districtId, districtName) => {
    setSelectedLocationIds((prev) => ({
      ...prev,
      districtId,
      communeId: "",
    }));
    handleFieldChange("district", districtName);
    loadCommunes(districtId);
  };

  const handleCommuneChange = (communeId, communeName) => {
    setSelectedLocationIds((prev) => ({
      ...prev,
      communeId,
    }));
    handleFieldChange("commune", communeName);
  };

  const handleLocationChange = (lat, lng) => {
    setSportCenter((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));

    form.setFieldsValue({
      latitude: lat,
      longitude: lng,
    });
  };

  // Custom upload handler for avatar
  const customAvatarUpload = async ({ file, onSuccess }) => {
    try {
      // Store the file in state
      setAvatarFile(file);
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
      setGalleryFiles((prev) => [...prev, file]);
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

      const formData = new FormData();

      formData.append("name", values.name || sportCenter.name);
      formData.append(
        "phoneNumber",
        values.phoneNumber || sportCenter.phoneNumber
      );
      formData.append(
        "addressLine",
        values.addressLine || sportCenter.addressLine
      );
      formData.append("city", sportCenter.city || values.city);
      formData.append("district", sportCenter.district || values.district);
      formData.append("commune", sportCenter.commune || values.commune);
      formData.append(
        "description",
        values.description || sportCenter.description
      );

      formData.append("latitude", values.latitude || sportCenter.latitude);
      formData.append("longitude", values.longitude || sportCenter.longitude);

      if (avatarFile) {
        formData.append("avatarImage", avatarFile);
      }

      // Add gallery files if they exist
      if (galleryFiles.length > 0) {
        galleryFiles.forEach((file) => {
          formData.append("GalleryImages", file);
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
      message.error(
        "Gặp lỗi trong quá trình tạo trung tâm thể thao. Vui lòng thử lại."
      );
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
      <div className="font-semibold text-2xl mb-4">
        Thiết lập trung tâm thể thao mới
      </div>

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
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên trung tâm thể thao",
                },
              ]}
            >
              <Input
                placeholder="Nhập tên trung tâm thể thao"
                onChange={(e) => handleFieldChange("name", e.target.value)}
              />
            </Form.Item>

            <Form.Item
              label="Số điện thoại"
              name="phoneNumber"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại" },
              ]}
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
                  rules={[
                    { required: true, message: "Vui lòng chọn Tỉnh/Thành phố" },
                  ]}
                >
                  <Select
                    placeholder="Chọn Tỉnh/Thành phố"
                    value={selectedLocationIds.provinceId}
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
                    loading={locationLoading.provinces}
                  >
                    {provinces.map((province) => (
                      <Select.Option key={province.id} value={province.id}>
                        {province.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Quận/Huyện"
                  name="district"
                  rules={[
                    { required: true, message: "Vui lòng chọn Quận/Huyện" },
                  ]}
                >
                  <Select
                    placeholder="Chọn Quận/Huyện"
                    value={selectedLocationIds.districtId}
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
                    loading={locationLoading.districts}
                    disabled={!selectedLocationIds.provinceId}
                  >
                    {districts.map((district) => (
                      <Select.Option key={district.id} value={district.id}>
                        {district.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Xã/Phường"
                  name="commune"
                  rules={[
                    { required: true, message: "Vui lòng chọn Xã/Phường" },
                  ]}
                >
                  <Select
                    placeholder="Chọn Xã/Phường"
                    value={selectedLocationIds.communeId}
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
                    loading={locationLoading.communes}
                    disabled={!selectedLocationIds.districtId}
                  >
                    {communes.map((commune) => (
                      <Select.Option key={commune.id} value={commune.id}>
                        {commune.name}
                      </Select.Option>
                    ))}
                  </Select>
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
              label={
                <span>
                  Logo trung tâm thể thao{" "}
                  <span style={{ color: "red" }}>(Bắt buộc)</span>
                </span>
              }
              name="avatarImage"
              rules={[
                {
                  required: true,
                  message: "Vui lòng tải lên logo trung tâm thể thao",
                },
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

            <Form.Item
              label="Hình ảnh trung tâm thể thao (Tối đa 5 ảnh)"
              name="galleryImages"
            >
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
                multiple={true}
                beforeUpload={(file, fileList) => {
                  if (galleryFiles.length + fileList.length > 5) {
                    message.error("Chỉ được tải lên tối đa 5 ảnh!");
                    return false;
                  }
                  return true;
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

        <Row>
          <Col span={24}>
            <LocationPicker
              latitude={sportCenter.latitude}
              longitude={sportCenter.longitude}
              onLocationChange={handleLocationChange}
              address={`${form.getFieldValue(
                "addressLine"
              )}, ${form.getFieldValue("district")}, ${form.getFieldValue(
                "commune"
              )}, ${form.getFieldValue("city")}`}
            />
          </Col>
        </Row>

        <Divider />

        <Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="latitude" label="Vĩ độ" hidden={true}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="longitude" label="Kinh độ" hidden={true}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>

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

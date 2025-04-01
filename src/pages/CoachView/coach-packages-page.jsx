import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Client as CoachClient } from "../../API/CoachApi";
import {
  Typography as MuiTypography, // Rename to avoid conflicts
  Box,
  Container,
  Grid,
  Paper,
  Divider,
} from "@mui/material";
import {
  Table,
  Modal,
  Input,
  Space,
  Tag,
  Spin,
  Empty,
  Select,
  Card as AntCard,
  message,
  Button,
  Tooltip,
  Popconfirm,
  Image,
  Badge,
  Pagination,
  Alert,
  Typography, // Import Ant Design Typography
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  DollarOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";

const { Option } = Select;
const { Search } = Input;
const { Meta } = AntCard;
const { confirm } = Modal;
const { Text, Paragraph, Title } = Typography; // Destructure Ant Design Typography components

const CoachPackagesPage = () => {
  const { coach_id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [packages, setPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [paginatedPackages, setPaginatedPackages] = useState([]);
  const [totalPackages, setTotalPackages] = useState(0);
  const [error, setError] = useState(null);

  // Add a ref to prevent infinite API calls
  const initialDataLoaded = useRef(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [statusFilter, setStatusFilter] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [currentPackage, setCurrentPackage] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    sessionCount: 0,
    status: "ACTIVE",
  });

  const client = new CoachClient();

  // Initial data fetch - only once after component mounts
  useEffect(() => {
    if (!initialDataLoaded.current) {
      fetchPackages();
      initialDataLoaded.current = true;
    }
  }, [coach_id]);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      let packagesData = [];

      if (coach_id) {
        // Fetch packages for a specific coach
        packagesData = await client.getActivePackages(coach_id);
      } else {
        // Fetch all packages for the coach (assuming logged in as coach)
        packagesData = await client.getCoachPackages();
      }

      setPackages(packagesData);
      setFilteredPackages(packagesData);
      setTotalPackages(packagesData.length);
      setError(null);
    } catch (err) {
      console.error("Error fetching packages:", err);
      setError("Failed to load packages. Please try again later.");
      message.error("Failed to load packages");
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  useEffect(() => {
    let result = [...packages];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (pkg) =>
          pkg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pkg.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter) {
      result = result.filter((pkg) => pkg.status === statusFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === "price_low") {
        return a.price - b.price;
      } else if (sortBy === "price_high") {
        return b.price - a.price;
      } else if (sortBy === "session_count") {
        return b.sessionCount - a.sessionCount;
      } else if (sortBy === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else {
        // Default sort by name
        return a.name?.localeCompare(b.name);
      }
    });

    setFilteredPackages(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [packages, searchTerm, sortBy, statusFilter]);

  // Apply pagination
  useEffect(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setPaginatedPackages(filteredPackages.slice(startIndex, endIndex));
  }, [filteredPackages, currentPage, pageSize]);

  // Form handling functions
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      sessionCount: 0,
      status: "ACTIVE",
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleNumberChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value !== "" ? Number(value) : 0,
    });
  };

  // CRUD operations
  const handleAddPackage = () => {
    setCurrentPackage(null);
    resetForm();
    setIsFormModalOpen(true);
  };

  const handleEditPackage = (packageData) => {
    setCurrentPackage(packageData);
    setFormData({
      name: packageData.name || "",
      description: packageData.description || "",
      price: packageData.price || 0,
      sessionCount: packageData.sessionCount || 0,
      status: packageData.status || "ACTIVE",
    });
    setIsFormModalOpen(true);
  };

  const handleDeletePackage = (packageId) => {
    confirm({
      title: "Are you sure you want to delete this package?",
      icon: <ExclamationCircleOutlined style={{ color: "red" }} />,
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await client.deletePackage(packageId);
          message.success("Package deleted successfully");
          fetchPackages(); // Refresh the list
        } catch (error) {
          console.error("Error deleting package:", error);
          message.error("Failed to delete package");
        }
      },
    });
  };

  const handleFormSubmit = async () => {
    // Validation
    if (!formData.name.trim()) {
      message.error("Package name is required");
      return;
    }

    if (!formData.description.trim()) {
      message.error("Description is required");
      return;
    }

    if (formData.price <= 0) {
      message.error("Price must be greater than 0");
      return;
    }

    if (formData.sessionCount <= 0) {
      message.error("Session count must be greater than 0");
      return;
    }

    try {
      setFormLoading(true);

      if (currentPackage) {
        // Update existing package
        const updateRequest = {
          name: formData.name,
          description: formData.description,
          price: formData.price,
          sessionCount: formData.sessionCount,
          status: formData.status,
        };

        await client.updatePackage(currentPackage.id, updateRequest);
        message.success("Package updated successfully");
      } else {
        // Create new package
        const createRequest = {
          coachId: coach_id, // Use coach_id from URL or from current user
          name: formData.name,
          description: formData.description,
          price: formData.price,
          sessionCount: formData.sessionCount,
        };

        await client.createPackage(createRequest);
        message.success("Package created successfully");
      }

      setIsFormModalOpen(false);
      fetchPackages(); // Refresh the list
    } catch (error) {
      console.error("Error saving package:", error);
      message.error("Failed to save package");
    } finally {
      setFormLoading(false);
    }
  };

  // Helper function to format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
        return "green";
      case "INACTIVE":
        return "red";
      case "DRAFT":
        return "orange";
      default:
        return "default";
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3 },
    },
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          mb: 3,
        }}
      >
        <Box
          sx={{
            p: 4,
            backgroundImage: "linear-gradient(to right, #1a9f6c, #0d6e4a)",
            color: "white",
            textAlign: "center",
            position: "relative",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <MuiTypography variant="h3" component="h1" gutterBottom>
              Coach Training Packages
            </MuiTypography>
            <MuiTypography
              variant="h6"
              sx={{ opacity: 0.8, maxWidth: 800, mx: "auto" }}
            >
              Enhance your skills with our professionally designed training
              packages
            </MuiTypography>
          </motion.div>
        </Box>

        <Box sx={{ p: 3, bgcolor: "#f9f9f9" }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Search
                placeholder="Search by name or description"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                allowClear
                prefix={<SearchOutlined />}
                size="large"
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <Select
                style={{ width: "100%" }}
                placeholder="Filter by Status"
                value={statusFilter || undefined}
                onChange={(value) => setStatusFilter(value)}
                allowClear
                size="large"
              >
                <Option value="ACTIVE">Active</Option>
                <Option value="INACTIVE">Inactive</Option>
                <Option value="DRAFT">Draft</Option>
              </Select>
            </Grid>

            <Grid item xs={12} md={3}>
              <Select
                style={{ width: "100%" }}
                placeholder="Sort by"
                value={sortBy}
                onChange={(value) => setSortBy(value)}
                size="large"
              >
                <Option value="name">Name (A-Z)</Option>
                <Option value="price_low">Price: Low to High</Option>
                <Option value="price_high">Price: High to Low</Option>
                <Option value="session_count">Session Count</Option>
                <Option value="newest">Newest First</Option>
              </Select>
            </Grid>

            <Grid item xs={12} md={2}>
              <Button
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                onClick={handleAddPackage}
                style={{ width: "100%", height: "40px" }}
              >
                Add Package
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </Box>
      ) : error ? (
        <Alert message="Error" description={error} type="error" showIcon />
      ) : filteredPackages.length === 0 ? (
        <Empty
          description="No packages found"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Grid container spacing={3}>
            {paginatedPackages.map((pkg) => (
              <Grid item xs={12} sm={6} md={4} key={pkg.id}>
                <motion.div variants={itemVariants}>
                  <AntCard
                    hoverable
                    cover={
                      <div
                        style={{
                          height: 180,
                          overflow: "hidden",
                          position: "relative",
                        }}
                      >
                        <Image
                          alt={pkg.name}
                          src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                          preview={false}
                          style={{
                            objectFit: "cover",
                            width: "100%",
                            height: "100%",
                          }}
                        />
                      </div>
                    }
                    actions={[
                      <Tooltip title="Edit" key="edit">
                        <EditOutlined onClick={() => handleEditPackage(pkg)} />
                      </Tooltip>,
                      <Tooltip title="Delete" key="delete">
                        <Popconfirm
                          title="Are you sure you want to delete this package?"
                          onConfirm={() => handleDeletePackage(pkg.id)}
                          okText="Yes"
                          cancelText="No"
                          placement="top"
                        >
                          <DeleteOutlined />
                        </Popconfirm>
                      </Tooltip>,
                    ]}
                    bodyStyle={{ padding: "20px" }}
                  >
                    <Meta
                      title={
                        <div style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}>
                          <Title level={4} style={{ marginBottom: 8 }}>
                            {pkg.name}
                          </Title>
                          <Badge
                            count={pkg.status}
                            style={{
                              backgroundColor:
                                getStatusColor(pkg.status) === "green"
                                  ? "#52c41a"
                                  : getStatusColor(pkg.status) === "red"
                                    ? "#f5222d"
                                    : "#faad14",
                            }}
                          />
                        </div>
                      }
                      description={
                        <Space
                          direction="vertical"
                          size="middle"
                          style={{ width: "100%" }}
                        >

                          <Paragraph
                            ellipsis={{ rows: 2 }}
                            style={{ height: 40, marginBottom: 16 }}
                          >
                            {pkg.description}
                          </Paragraph>

                          <Space
                            direction="vertical"
                            size="small"
                            style={{ width: "100%" }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Space>
                                <DollarOutlined style={{ color: "#1a9f6c" }} />
                                <Text strong>Price:</Text>
                              </Space>
                              <Text strong style={{ color: "#1a9f6c" }}>
                                {formatPrice(pkg.price)}
                              </Text>
                            </Box>

                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Space>
                                <CalendarOutlined
                                  style={{ color: "#1a9f6c" }}
                                />
                                <Text strong>Sessions:</Text>
                              </Space>
                              <Text>{pkg.sessionCount} sessions</Text>
                            </Box>

                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Space>
                                <ClockCircleOutlined
                                  style={{ color: "#1a9f6c" }}
                                />
                                <Text strong>Created:</Text>
                              </Space>
                              <Text>
                                {new Date(pkg.createdAt).toLocaleDateString()}
                              </Text>
                            </Box>
                          </Space>
                        </Space>
                      }
                    />
                  </AntCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredPackages.length}
              onChange={(page) => setCurrentPage(page)}
              showSizeChanger
              onShowSizeChange={(current, size) => {
                setPageSize(size);
                setCurrentPage(1);
              }}
              pageSizeOptions={["6", "9", "12", "24"]}
              showTotal={(total) => `Total ${total} packages`}
            />
          </Box>
        </motion.div>
      )}

      {/* Package Form Modal */}
      <Modal
        title={currentPackage ? "Edit Package" : "Create New Package"}
        open={isFormModalOpen}
        onCancel={() => setIsFormModalOpen(false)}
        footer={null}
        width={700}
      >
        <Spin spinning={formLoading}>
          <form>
            <Box sx={{ mb: 3 }}>
              <Text strong>Package Name</Text>
              <Input
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="Enter package name"
                required
                style={{ marginTop: 8 }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Text strong>Description</Text>
              <Input.TextArea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                placeholder="Enter package description"
                rows={4}
                required
                style={{ marginTop: 8 }}
              />
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Text strong>Price (VND)</Text>
                  <Input
                    type="number"
                    min={0}
                    name="price"
                    value={formData.price}
                    onChange={(e) =>
                      handleNumberChange("price", e.target.value)
                    }
                    placeholder="Enter price"
                    required
                    style={{ marginTop: 8 }}
                    prefix={<DollarOutlined />}
                  />
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Text strong>Number of Sessions</Text>
                  <Input
                    type="number"
                    min={1}
                    name="sessionCount"
                    value={formData.sessionCount}
                    onChange={(e) =>
                      handleNumberChange("sessionCount", e.target.value)
                    }
                    placeholder="Enter session count"
                    required
                    style={{ marginTop: 8 }}
                    prefix={<CalendarOutlined />}
                  />
                </Box>
              </Grid>
            </Grid>

            {currentPackage && (
              <Box sx={{ mb: 3 }}>
                <Text strong>Status</Text>
                <Select
                  style={{ width: "100%", marginTop: 8 }}
                  value={formData.status}
                  onChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <Option value="ACTIVE">Active</Option>
                  <Option value="INACTIVE">Inactive</Option>
                  <Option value="DRAFT">Draft</Option>
                </Select>
              </Box>
            )}

            <Divider />

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 3,
              }}
            >
              <Button onClick={() => setIsFormModalOpen(false)}>Cancel</Button>
              <Button
                type="primary"
                onClick={handleFormSubmit}
                loading={formLoading}
              >
                {currentPackage ? "Update Package" : "Create Package"}
              </Button>
            </Box>
          </form>
        </Spin>
      </Modal>
    </Container>
  );
};

export default CoachPackagesPage;

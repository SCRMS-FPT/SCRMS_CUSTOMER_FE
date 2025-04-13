import React, { useState, useEffect } from "react";
import {
  Card,
  Rate,
  Tag,
  Input,
  Select,
  Button,
  Slider,
  Spin,
  Empty,
  message,
  Space,
  Avatar,
  Divider,
  Typography,
  List,
} from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  UserOutlined,
  StarOutlined,
  DollarOutlined,
  CalendarOutlined,
  RightOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Client } from "@/API/CoachApi";
import { Client as CourtClient } from "@/API/CourtApi";
import {
  Box,
  Grid,
  Paper,
  Chip,
  LinearProgress,
  Skeleton,
  Stack,
  Pagination,
  FormControl,
  InputLabel,
  Rating,
  Tooltip,
} from "@mui/material";
import { styled, alpha, useTheme } from "@mui/material/styles";
import {
  SportsTennis,
  SportsBasketball,
  DirectionsRun,
  Verified,
  BookOnline,
} from "@mui/icons-material";

const { Option } = Select;
const { Search } = Input;
const { Text, Title } = Typography;

// Custom styled components using MUI's styled
const StyledCard = styled(Card)(({ theme }) => ({
  transition: "all 0.3s",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
  },
}));

const StyledRate = styled(Rate)({
  fontSize: "16px",
});

const SportIcon = ({ sport }) => {
  // Map sport names to icons (customize as needed)
  switch (sport?.toLowerCase()) {
    case "tennis":
      return <SportsTennis />;
    case "basketball":
      return <SportsBasketball />;
    default:
      return <DirectionsRun />;
  }
};

const CoachList = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [coaches, setCoaches] = useState([]);
  const [sports, setSports] = useState([]);
  const [searchText, setSearchText] = useState("");
  // Initialize selectedSport as undefined, not null
  const [selectedSport, setSelectedSport] = useState(undefined);
  const [priceRange, setPriceRange] = useState([100000, 500000]);
  const [sortOrder, setSortOrder] = useState("rating");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 9,
    total: 0,
  });
  const [error, setError] = useState(null);

  const client = new Client();
  const courtClient = new CourtClient();

  // Fetch coaches based on current filters
  useEffect(() => {
    fetchCoaches();
    fetchSports();
  }, [pagination.current, selectedSport, priceRange, sortOrder]);

  const fetchCoaches = async () => {
    try {
      setLoading(true);
      setError(null);

      // Convert empty strings to undefined and null to undefined
      const nameParam = searchText === "" ? undefined : searchText;
      const sportIdParam = selectedSport === null ? undefined : selectedSport;
      const minPriceParam = priceRange[0];
      const maxPriceParam = priceRange[1];

      // Convert from 1-based UI pagination to 0-based API pagination
      const pageIndex = pagination.current - 1;
      const pageSize = pagination.pageSize;

      console.log("API Call Parameters:", {
        name: nameParam,
        sportId: sportIdParam,
        minPrice: minPriceParam,
        maxPrice: maxPriceParam,
        pageIndex,
        pageSize,
      });

      // Call the API with all parameters including pagination
      const response = await client.getCoaches(
        nameParam,
        sportIdParam,
        minPriceParam,
        maxPriceParam,
        pageIndex,
        pageSize
      );

      console.log("API Response:", response);

      if (response) {
        // Extract coaches from data array in response
        const coachesData = response.data || [];

        setCoaches(coachesData);
        setPagination({
          ...pagination,
          total: response.count || 0,
        });
      } else {
        setCoaches([]);
        setPagination({
          ...pagination,
          total: 0,
        });
      }
    } catch (err) {
      console.error("Error fetching coaches:", err);
      setError("Không thể tải dữ liệu huấn luyện viên. Vui lòng thử lại sau.");
      message.error("Không thể tải dữ liệu huấn luyện viên");
    } finally {
      setLoading(false);
    }
  };

  const fetchSports = async () => {
    try {
      const response = await courtClient.getSports();
      if (response) {
        setSports(response.sports || []);
      }
    } catch (err) {
      console.error("Error fetching sports:", err);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
    // Reset pagination when searching
    setPagination({
      ...pagination,
      current: 1,
    });
  };

  const handleSportChange = (value) => {
    // If user clears the selection, set to undefined, not null
    setSelectedSport(value === null ? undefined : value);
    // Reset pagination when changing filters
    setPagination({
      ...pagination,
      current: 1,
    });
  };

  const handlePriceChange = (value) => {
    setPriceRange(value);
    // Reset pagination when changing filters
    setPagination({
      ...pagination,
      current: 1,
    });
  };

  const handleSortChange = (value) => {
    setSortOrder(value);
  };

  const handlePageChange = (page) => {
    setPagination({
      ...pagination,
      current: page,
    });
  };

  const resetFilters = () => {
    // Reset to empty string instead of undefined
    setSearchText("");
    // Set to undefined instead of null
    setSelectedSport(undefined);
    setPriceRange([100000, 500000]);
    setSortOrder("rating");
    setPagination({
      ...pagination,
      current: 1,
    });
  };

  // Filter coaches by search text (client-side)
  const filteredCoaches = coaches.filter(
    (coach) =>
      !searchText ||
      coach.fullName.toLowerCase().includes(searchText.toLowerCase())
  );

  // Function to format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Loading skeleton component
  const CoachSkeleton = () => (
    <Grid container spacing={3}>
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <Grid
          key={item}
          size={{
            xs: 12,
            sm: 6,
            md: 4,
          }}
        >
          <Paper sx={{ p: 2, height: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Skeleton variant="circular" width={64} height={64} />
              <Box sx={{ ml: 2, width: "100%" }}>
                <Skeleton variant="text" width="70%" height={24} />
                <Skeleton variant="text" width="40%" height={20} />
              </Box>
            </Box>
            <Skeleton variant="rectangular" height={120} />
            <Box sx={{ mt: 2 }}>
              <Skeleton variant="text" width="90%" />
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
              >
                <Skeleton variant="rectangular" width="45%" height={36} />
                <Skeleton variant="rectangular" width="45%" height={36} />
              </Box>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box sx={{ py: 4, px: 3 }}>
      <Box sx={{ mb: 4, display: "flex", flexDirection: "column" }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Tìm Huấn Luyện Viên Phù Hợp
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Duyệt qua các huấn luyện viên chuyên nghiệp và tìm người phù hợp cho
          nhu cầu tập luyện của bạn
        </Typography>
      </Box>
      {/* Search & Filter Panel */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 2,
          background: `linear-gradient(to right, ${alpha(
            theme.palette.primary.light,
            0.1
          )}, ${alpha(theme.palette.background.paper, 0.6)})`,
        }}
      >
        <Grid container spacing={3}>
          <Grid
            size={{
              xs: 12,
              md: 4,
            }}
          >
            <Search
              placeholder="Tìm huấn luyện viên theo tên"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={handleSearch}
              enterButton
              allowClear
            />
          </Grid>

          <Grid
            size={{
              xs: 12,
              md: 3,
            }}
          >
            <FormControl fullWidth>
              <Select
                placeholder="Lọc theo môn thể thao"
                value={selectedSport}
                onChange={handleSportChange}
                allowClear
                style={{ width: "100%" }}
              >
                {sports.map((sport) => (
                  <Option key={sport.id} value={sport.id}>
                    <Space>
                      <SportIcon sport={sport.name} />
                      {sport.name}
                    </Space>
                  </Option>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid
            size={{
              xs: 12,
              md: 3,
            }}
          >
            <Select
              placeholder="Sắp xếp theo"
              value={sortOrder}
              onChange={handleSortChange}
              style={{ width: "100%" }}
            >
              <Option value="rating">
                <Space>
                  <StarOutlined />
                  Đánh giá cao nhất
                </Space>
              </Option>
              <Option value="priceAsc">
                <Space>
                  <SortAscendingOutlined />
                  Giá: Thấp đến cao
                </Space>
              </Option>
              <Option value="priceDesc">
                <Space>
                  <SortAscendingOutlined
                    style={{ transform: "rotateX(180deg)" }}
                  />
                  Giá: Cao đến thấp
                </Space>
              </Option>
            </Select>
          </Grid>

          <Grid
            size={{
              xs: 12,
              md: 2,
            }}
          >
            <Button
              icon={<FilterOutlined />}
              onClick={resetFilters}
              style={{ width: "100%" }}
            >
              Đặt lại bộ lọc
            </Button>
          </Grid>

          <Grid size={12}>
            <Typography id="price-range-slider" gutterBottom>
              Khoảng giá: {formatPrice(priceRange[0])} -{" "}
              {formatPrice(priceRange[1])}
            </Typography>
            <Slider
              value={priceRange}
              onChange={handlePriceChange}
              min={50000}
              max={1000000}
              step={50000}
              marks={{
                50000: "50K",
                250000: "250K",
                500000: "500K",
                750000: "750K",
                1000000: "1M",
              }}
              valueLabelFormat={formatPrice}
              valueLabelDisplay="auto"
            />
          </Grid>
        </Grid>
      </Paper>
      {/* Loading State */}
      {loading && <CoachSkeleton />}
      {/* Error State */}
      {error && (
        <Box sx={{ textAlign: "center", py: 5 }}>
          <Typography variant="h6" color="error" gutterBottom>
            {error}
          </Typography>
          <Button variant="contained" onClick={fetchCoaches} sx={{ mt: 2 }}>
            Thử lại
          </Button>
        </Box>
      )}
      {/* Empty State */}
      {!loading && !error && filteredCoaches.length === 0 && (
        <Box sx={{ textAlign: "center", py: 5 }}>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <Typography variant="body1">
                Không tìm thấy huấn luyện viên phù hợp với tiêu chí của bạn. Hãy
                điều chỉnh bộ lọc.
              </Typography>
            }
          />
          <Button
            type="primary"
            onClick={resetFilters}
            style={{ marginTop: 16 }}
          >
            Đặt lại bộ lọc
          </Button>
        </Box>
      )}
      {/* Coach Grid */}
      {!loading && !error && filteredCoaches.length > 0 && (
        <>
          <Grid container spacing={3}>
            {filteredCoaches.map((coach) => (
              <Grid
                key={coach.id}
                size={{
                  xs: 12,
                  sm: 6,
                  md: 4,
                }}
              >
                <StyledCard
                  hoverable
                  cover={
                    <Box
                      sx={{
                        height: 200,
                        overflow: "hidden",
                        position: "relative",
                        bgcolor: "grey.100",
                      }}
                    >
                      <img
                        alt={coach.fullName}
                        src={
                          coach.avatar ||
                          "https://via.placeholder.com/300x200?text=HLV"
                        }
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          p: 1,
                          background:
                            "linear-gradient(transparent, rgba(0,0,0,0.7))",
                          backdropFilter: "blur(3px)",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Chip
                            icon={<DollarOutlined />}
                            label={formatPrice(coach.ratePerHour)}
                            sx={{
                              bgcolor: alpha(theme.palette.success.main, 0.9),
                              color: "white",
                              fontWeight: "bold",
                            }}
                          />
                          <Rating
                            value={coach.rating || 0}
                            readOnly
                            precision={0.5}
                          />
                        </Box>
                      </Box>
                    </Box>
                  }
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Avatar
                      src={coach.avatar}
                      size={50}
                      style={{
                        border: `2px solid ${theme.palette.primary.main}`,
                        marginRight: 12,
                      }}
                    />
                    <Box>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography variant="h6" fontWeight="bold" noWrap>
                          {coach.fullName}
                        </Typography>
                        {coach.isVerified && (
                          <Tooltip title="Huấn luyện viên đã xác thực">
                            <Verified
                              sx={{
                                ml: 0.5,
                                color: theme.palette.info.main,
                                fontSize: 18,
                              }}
                            />
                          </Tooltip>
                        )}
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mt: 0.5 }}
                      >
                        <Chip
                          size="small"
                          variant="outlined"
                          icon={<SportIcon sport={coach.sportName} />}
                          label={coach.sportName}
                          sx={{ mr: 1 }}
                        />
                        <Chip
                          size="small"
                          variant="outlined"
                          icon={<TeamOutlined />}
                          label={`${
                            coach.experienceYears || 1
                          }+ năm kinh nghiệm`}
                        />
                      </Box>
                    </Box>
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{ mb: 2, height: 60, overflow: "hidden" }}
                  >
                    {coach.bio ||
                      "Chưa có thông tin giới thiệu. Huấn luyện viên này muốn để kỹ năng của họ tự nói lên qua khóa huấn luyện."}
                  </Typography>

                  <Box
                    sx={{
                      mt: "auto",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Button
                      type="default"
                      icon={<CalendarOutlined />}
                      onClick={() => navigate(`/coaches/${coach.id}`)}
                    >
                      Xem chi tiết
                    </Button>
                    <Button
                      type="primary"
                      icon={<BookOnline />}
                      onClick={() => navigate(`/coaches/${coach.id}/book`)}
                    >
                      Đặt lịch ngay
                    </Button>
                  </Box>
                </StyledCard>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onChange={handlePageChange}
              showSizeChanger={false}
              showTotal={(total) => `Tổng cộng ${total} huấn luyện viên`}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default CoachList;

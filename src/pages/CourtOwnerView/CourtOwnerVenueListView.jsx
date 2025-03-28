import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Tag,
  Tooltip,
  Input,
  Select,
  Space,
  message,
  Spin,
} from "antd";
import { useNavigate } from "react-router-dom";
import CourtOwnerSidebar from "@/components/CourtComponents/CourtOwnerSidebar";
import { Client } from "@/API/CourtApi";

const { Option } = Select;
const MAX_SPORTS_DISPLAY = 3;
const client = new Client();

const CourtOwnerVenueListView = () => {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedSport, setSelectedSport] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch sports and venues when component mounts or filters change
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch sports for filter dropdown
        const sportsResponse = await client.getSports();
        setSports(sportsResponse.sports || []);

        // Fetch venues (sport centers) owned by the current user
        const venuesResponse = await client.getOwnedSportCenters(
          page,
          pageSize,
          undefined, // city
          searchText || undefined, // name
          selectedSport !== "all" ? selectedSport : undefined, // sportId
          undefined, // bookingDate
          undefined, // startTime
          undefined // endTime
        );

        setVenues(venuesResponse.sportCenters?.data || []);
        setTotalCount(venuesResponse.sportCenters?.count || 0);
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, pageSize, searchText, selectedSport]);

  // Handle search with debounce
  const handleSearch = (value) => {
    setSearchText(value);
    setPage(1); // Reset to first page when searching
  };

  const columns = [
    {
      title: "Venue Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => (
        <span className="font-semibold text-indigo-600">{text}</span>
      ),
    },
    {
      title: "Location",
      dataIndex: "address",
      key: "location",
      render: (address) => address || "No address provided",
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Sports",
      dataIndex: "sportNames",
      key: "sports",
      render: (sportNames = []) => {
        const limitedSports = sportNames.slice(0, MAX_SPORTS_DISPLAY);
        const remainingSports = sportNames.slice(MAX_SPORTS_DISPLAY);
        return (
          <>
            {limitedSports.map((sport) => (
              <Tag color="blue" key={sport}>
                {sport}
              </Tag>
            ))}
            {remainingSports.length > 0 && (
              <Tooltip title={remainingSports.join(", ")}>
                <Tag color="gray" className="cursor-pointer">
                  +{remainingSports.length}
                </Tag>
              </Tooltip>
            )}
          </>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            onClick={() => navigate(`/court-owner/venues/${record.id}`)}
          >
            Manage
          </Button>
          <Button onClick={() => navigate(`/court-owner/venues/${record.id}`)}>
            Courts
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="My Venues"
      extra={
        <Button
          type="primary"
          onClick={() => navigate("/court-owner/venues/create")}
        >
          Add New Venue
        </Button>
      }
    >
      {/* Search & Filter Controls */}
      <Space className="mb-4" wrap>
        <Input
          placeholder="Search Venue Name"
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 200 }}
        />
        <Select
          value={selectedSport}
          onChange={(value) => {
            setSelectedSport(value);
            setPage(1); // Reset to first page when changing filters
          }}
          style={{ width: 150 }}
          placeholder="Filter by Sport"
        >
          <Option value="all">All Sports</Option>
          {sports.map((sport) => (
            <Option key={sport.id} value={sport.id}>
              {sport.name}
            </Option>
          ))}
        </Select>
      </Space>

      {/* Venues Table */}
      {loading ? (
        <div className="flex justify-center items-center p-10">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          dataSource={venues}
          rowKey="id"
          columns={columns}
          pagination={{
            current: page,
            pageSize: pageSize,
            total: totalCount,
            onChange: (page, pageSize) => {
              setPage(page);
              setPageSize(pageSize);
            },
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
          }}
          locale={{ emptyText: "No venues found" }}
        />
      )}
    </Card>
  );
};

export default CourtOwnerVenueListView;

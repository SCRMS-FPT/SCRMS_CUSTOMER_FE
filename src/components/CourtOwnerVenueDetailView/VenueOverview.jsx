import PropTypes from "prop-types";
import { Card, Row, Col, Avatar } from "antd";
import {
  EnvironmentOutlined,
  PhoneOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

const VenueOverview = ({ venue }) => {
  if (!venue) return null;

  // Format the address from available fields
  const fullAddress = [
    venue.addressLine,
    venue.commune,
    venue.district,
    venue.city,
  ]
    .filter(Boolean)
    .join(", ");

  // Format creation date
  const formattedDate = venue.createdAt
    ? new Date(venue.createdAt).toLocaleDateString()
    : "N/A";

  return (
    <Card className="mb-4">
      <Row gutter={[16, 0]}>
        <Col xs={24} sm={6} md={4} lg={3}>
          {venue.avatar && (
            <Avatar
              src={venue.avatar}
              size={100}
              shape="square"
              style={{ border: "1px solid #eee" }}
            />
          )}
        </Col>
        <Col xs={24} sm={18} md={20} lg={21}>
          <h2 className="text-2xl font-bold mb-4">
            {venue.name || "Unnamed Venue"}
          </h2>

          <div className="ml-0">
            <p className="flex items-center mb-3">
              <EnvironmentOutlined
                style={{ color: "green", fontSize: "18px" }}
                className="mr-2"
              />
              <strong className="mr-1">Address:</strong>{" "}
              {fullAddress || "No address provided"}
            </p>

            <p className="flex items-center mb-3">
              <PhoneOutlined
                style={{ color: "blue", fontSize: "18px" }}
                className="mr-2"
              />
              <strong className="mr-1">Contact:</strong>{" "}
              {venue.phoneNumber || "No phone number provided"}
            </p>

            <p className="flex items-center mb-1">
              <CalendarOutlined
                style={{ color: "orange", fontSize: "18px" }}
                className="mr-2"
              />
              <strong className="mr-1">Registered since:</strong>{" "}
              {formattedDate}
            </p>

            {venue.description && (
              <div className="mt-4">
                <strong>Description:</strong>
                <p className="mt-1">{venue.description}</p>
              </div>
            )}
          </div>
        </Col>
      </Row>
    </Card>
  );
};

// Add prop type validation
VenueOverview.propTypes = {
  venue: PropTypes.shape({
    id: PropTypes.string,
    ownerId: PropTypes.string,
    name: PropTypes.string,
    phoneNumber: PropTypes.string,
    addressLine: PropTypes.string,
    city: PropTypes.string,
    district: PropTypes.string,
    commune: PropTypes.string,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    avatar: PropTypes.string,
    imageUrls: PropTypes.arrayOf(PropTypes.string),
    description: PropTypes.string,
    createdAt: PropTypes.string,
    lastModified: PropTypes.string,
  }),
};

export default VenueOverview;

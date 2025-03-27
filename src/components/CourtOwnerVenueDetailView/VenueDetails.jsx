import PropTypes from "prop-types";
import { Card, Tag, Tooltip, Empty } from "antd";
import {
  TrophyOutlined,
  BuildOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";

const MAX_DISPLAY = 4;

const VenueDetails = ({ venue, courts = [] }) => {
  if (!venue) return null;

  // Helper function to display a limited number of tags with a tooltip for the remaining ones
  const renderLimitedTags = (items = [], color, max) => {
    if (!items.length)
      return <span className="text-gray-400">None available</span>;

    const limitedItems = items.slice(0, max);
    const remainingItems = items.slice(max);

    return (
      <>
        {limitedItems.map((item) => (
          <Tag color={color} key={item?.id || item}>
            {item?.name || item}
          </Tag>
        ))}
        {remainingItems.length > 0 && (
          <Tooltip
            title={remainingItems.map((item) => item?.name || item).join(", ")}
          >
            <Tag color="gray">+{remainingItems.length}</Tag>
          </Tooltip>
        )}
      </>
    );
  };

  // Use sportNames array if exists, or default to an empty array
  const sports = venue.sportNames || [];

  // Use facilities array if exists, or default to an empty array
  const amenities = venue.facilities || [];

  return (
    <Card className="mb-4">
      <p className="flex items-center mb-2">
        <TrophyOutlined
          style={{ color: "blue", marginRight: 5, fontSize: "18px" }}
        />
        <strong className="mr-3">Sports:</strong>
        {renderLimitedTags(sports, "blue", MAX_DISPLAY)}
      </p>

      <p className="flex items-center mb-2">
        <BuildOutlined
          style={{ color: "green", marginRight: 5, fontSize: "18px" }}
        />
        <strong className="mr-3">Amenities:</strong>
        {renderLimitedTags(amenities, "green", MAX_DISPLAY)}
      </p>

      <p className="flex items-center mb-2">
        <AppstoreOutlined
          style={{ color: "purple", marginRight: 5, fontSize: "18px" }}
        />
        <strong className="mr-2">Courts:</strong>
        {courts.length}
      </p>

      {venue.operatingHours && venue.operatingHours.length > 0 && (
        <p className="flex items-start mb-2">
          <ClockCircleOutlined
            style={{
              color: "orange",
              marginRight: 5,
              fontSize: "18px",
              marginTop: 4,
            }}
          />
          <div>
            <strong className="mr-3 block">Operating Hours:</strong>
            <div className="pl-2">
              {venue.operatingHours.map((hour, index) => (
                <div key={index} className="text-sm mb-1">
                  <strong>{getDayName(hour.dayOfWeek)}:</strong>{" "}
                  {formatTime(hour.startTime)} - {formatTime(hour.endTime)}
                </div>
              ))}
            </div>
          </div>
        </p>
      )}
    </Card>
  );
};

// Helper functions for formatting
const getDayName = (dayNumber) => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[dayNumber % 7];
};

const formatTime = (timeString) => {
  if (!timeString) return "";
  // Format time string (e.g., "08:00:00" to "8:00 AM")
  try {
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  } catch (e) {
    return timeString;
  }
};

// Add prop type validation
VenueDetails.propTypes = {
  venue: PropTypes.shape({
    id: PropTypes.string,
    sportNames: PropTypes.arrayOf(PropTypes.string),
    facilities: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        description: PropTypes.string,
      })
    ),
    operatingHours: PropTypes.arrayOf(
      PropTypes.shape({
        dayOfWeek: PropTypes.number,
        startTime: PropTypes.string,
        endTime: PropTypes.string,
      })
    ),
  }),
  courts: PropTypes.array,
};

export default VenueDetails;

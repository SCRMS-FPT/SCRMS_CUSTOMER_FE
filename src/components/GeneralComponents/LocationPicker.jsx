import React, { useEffect, useRef, useState } from "react";
import { Card, Input, Space, Typography, Alert, Button } from "antd";
import { EnvironmentOutlined, AimOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Leaflet requires manual handling of marker icons
// Fix default icon issue - use imported versions instead of URL references
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const { Text } = Typography;

const MapMarker = ({ position, onDragEnd }) => {
  return (
    <Marker
      position={position}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const position = marker.getLatLng();
          onDragEnd(position);
        },
      }}
    >
      <Popup>Vị trí đã chọn</Popup>
    </Marker>
  );
};

const MapEvents = ({ onClick }) => {
  useMapEvents({
    click: (e) => {
      onClick(e.latlng);
    },
  });
  return null;
};

const defaultCenter = {
  lat: 21.0278, // Default to Hanoi, Vietnam
  lng: 105.8342,
};

const LocationPicker = ({ latitude, longitude, onLocationChange, address }) => {
  const [center, setCenter] = useState(
    latitude && longitude
      ? { lat: parseFloat(latitude), lng: parseFloat(longitude) }
      : defaultCenter
  );

  const [markerPosition, setMarkerPosition] = useState(
    latitude && longitude
      ? { lat: parseFloat(latitude), lng: parseFloat(longitude) }
      : null
  );

  const [searchQuery, setSearchQuery] = useState("");
  const mapRef = useRef(null);
  const [isGeocodingAddress, setIsGeocodingAddress] = useState(false);

  // Update center and marker if props change
  useEffect(() => {
    if (latitude && longitude) {
      const newPos = { lat: parseFloat(latitude), lng: parseFloat(longitude) };
      setCenter(newPos);
      setMarkerPosition(newPos);
    }
  }, [latitude, longitude]);

  // Geocode the address when it changes
  useEffect(() => {
    if (address && !isGeocodingAddress) {
      geocodeAddress(address);
    }
  }, [address]);

  const geocodeAddress = (addressString) => {
    if (!addressString || addressString.trim() === "") return;

    setIsGeocodingAddress(true);

    // Using Nominatim API for geocoding
    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        addressString
      )}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data && data.length > 0) {
          const location = data[0];
          const newPos = {
            lat: parseFloat(location.lat),
            lng: parseFloat(location.lon),
          };

          setMarkerPosition(newPos);
          setCenter(newPos);

          // Call the parent component's callback with the new coordinates
          if (onLocationChange) {
            onLocationChange(newPos.lat, newPos.lng);
          }

          // Pan to the location
          if (mapRef.current) {
            mapRef.current.setView(newPos, 15);
          }
        }
      })
      .catch((error) => {
        console.error("Error geocoding address:", error);
      })
      .finally(() => {
        setIsGeocodingAddress(false);
      });
  };

  const handleMapClick = (latlng) => {
    const newPos = {
      lat: latlng.lat,
      lng: latlng.lng,
    };
    setMarkerPosition(newPos);

    // Call the parent component's callback with the new coordinates
    if (onLocationChange) {
      onLocationChange(newPos.lat, newPos.lng);
    }
  };

  const handleMarkerDrag = (latlng) => {
    const newPos = {
      lat: latlng.lat,
      lng: latlng.lng,
    };
    setMarkerPosition(newPos);

    // Call the parent component's callback with the new coordinates
    if (onLocationChange) {
      onLocationChange(newPos.lat, newPos.lng);
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    // Using Nominatim API for geocoding (OpenStreetMap's free geocoding service)
    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        searchQuery
      )}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data && data.length > 0) {
          const location = data[0];
          const newPos = {
            lat: parseFloat(location.lat),
            lng: parseFloat(location.lon),
          };

          setMarkerPosition(newPos);
          setCenter(newPos);

          // Call the parent component's callback with the new coordinates
          if (onLocationChange) {
            onLocationChange(newPos.lat, newPos.lng);
          }

          // Pan to the location
          if (mapRef.current) {
            mapRef.current.setView(newPos, 15);
          }
        }
      })
      .catch((error) => {
        console.error("Error searching for location:", error);
      });
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          setMarkerPosition(newPos);
          setCenter(newPos);

          // Call the parent component's callback with the new coordinates
          if (onLocationChange) {
            onLocationChange(newPos.lat, newPos.lng);
          }

          // Pan to the location
          if (mapRef.current) {
            mapRef.current.setView(newPos, 15);
          }
        },
        (error) => {
          console.error("Error getting current location:", error);
        }
      );
    }
  };

  return (
    <Card title="Chọn vị trí trên bản đồ">
      <Space direction="vertical" style={{ width: "100%" }}>
        <Alert
          message="Bấm vào bản đồ để chọn vị trí hoặc tìm kiếm địa chỉ"
          description="Vị trí chính xác sẽ giúp người dùng tìm thấy sân của bạn dễ dàng hơn"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <Space style={{ width: "100%", marginBottom: 16 }}>
          <Input
            placeholder="Nhập địa chỉ để tìm kiếm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onPressEnter={handleSearch}
            style={{ flex: 1 }}
          />
          <Button
            type="primary"
            onClick={handleSearch}
            icon={<EnvironmentOutlined />}
          >
            Tìm kiếm
          </Button>
          <Button onClick={handleCurrentLocation} icon={<AimOutlined />}>
            Vị trí của tôi
          </Button>
        </Space>

        <div style={{ height: 400, width: "100%" }}>
          <MapContainer
            center={center}
            zoom={15}
            style={{ height: "100%", width: "100%" }}
            ref={mapRef}
            whenCreated={(map) => {
              mapRef.current = map;
            }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapEvents onClick={handleMapClick} />
            {markerPosition && (
              <MapMarker
                position={markerPosition}
                onDragEnd={handleMarkerDrag}
              />
            )}
          </MapContainer>
        </div>

        {markerPosition && (
          <div style={{ marginTop: 16 }}>
            <Text strong>Tọa độ đã chọn:</Text>
            <Space>
              <Text>Vĩ độ: {markerPosition.lat.toFixed(6)}</Text>
              <Text>Kinh độ: {markerPosition.lng.toFixed(6)}</Text>
            </Space>
          </div>
        )}
      </Space>
    </Card>
  );
};

LocationPicker.propTypes = {
  latitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  longitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onLocationChange: PropTypes.func.isRequired,
  address: PropTypes.string,
};

export default LocationPicker;

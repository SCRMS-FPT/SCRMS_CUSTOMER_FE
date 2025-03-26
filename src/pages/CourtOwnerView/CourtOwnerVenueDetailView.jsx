import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Spin, Button, message, Row, Col, Divider } from "antd";
import { LeftOutlined, PlusOutlined } from "@ant-design/icons";
import { Client } from "@/API/CourtApi";

import VenueOverview from "@/components/CourtOwnerVenueDetailView/VenueOverview";
import VenueDetails from "@/components/CourtOwnerVenueDetailView/VenueDetails";
import VenueOperatingHoursTable from "@/components/CourtOwnerVenueDetailView/VenueOperatingHoursTable";
import VenuePricingMembership from "@/components/CourtOwnerVenueDetailView/VenuePricingMembership";
import VenueBookingPolicy from "@/components/CourtOwnerVenueDetailView/VenueBookingPolicy";
import VenueCourtsList from "@/components/CourtOwnerVenueDetailView/VenueCourtsList";

const client = new Client();

const CourtOwnerVenueDetailView = () => {
  const { venueId } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState(null);
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVenueData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch venue details
        const venueData = await client.getSportCenterById(venueId);
        console.log("📊 Venue data from API:", venueData);
        setVenue(venueData);

        // Fetch courts for this venue
        const courtsResponse = await client.getCourts(
          0,
          50,
          venueId,
          undefined,
          undefined
        );
        console.log("🎾 Courts data from API:", courtsResponse);
        setCourts(courtsResponse.courts?.data || []);
      } catch (err) {
        console.error("Error fetching venue data:", err);
        setError("Failed to load venue data. Please try again.");
        message.error("Failed to load venue data");
      } finally {
        setLoading(false);
      }
    };

    if (venueId) {
      fetchVenueData();
    }
  }, [venueId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !venue) {
    return (
      <div className="flex flex-col justify-center items-center h-96">
        <p className="text-red-500 text-xl">{error || "Venue not found."}</p>
        <Button
          type="primary"
          onClick={() => navigate("/court-owner/venues")}
          className="mt-4"
        >
          Back to Venues
        </Button>
      </div>
    );
  }

  // Convert API data structure to component format if needed
  const venueForComponents = {
    ...venue,
    // Map any fields needed by child components
    operating_hours: venue.operatingHours || [],
    pricing_model: venue.pricingModel || {},
    booking_policy: venue.bookingPolicy || {},
  };

  return (
    <Card
      title={
        <div className="flex items-center justify-between w-full">
          <Button
            type="link"
            icon={<LeftOutlined />}
            onClick={() => navigate("/court-owner/venues")}
            className="mr-2"
          >
            Back to Venues
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate(`/court-owner/courts/create/${venueId}`)}
          >
            Add New Court
          </Button>
        </div>
      }
    >
      <VenueOverview venue={venueForComponents} />

      <Divider />

      <VenueDetails venue={venueForComponents} />

      {/* Conditionally render these components if the data exists */}
      {venueForComponents.operating_hours &&
        venueForComponents.operating_hours.length > 0 && (
          <>
            <Divider />
            <VenueOperatingHoursTable
              operatingHours={venueForComponents.operating_hours}
            />
          </>
        )}

      {venueForComponents.pricing_model &&
        Object.keys(venueForComponents.pricing_model).length > 0 && (
          <>
            <Divider />
            <VenuePricingMembership
              pricing={venueForComponents.pricing_model}
            />
          </>
        )}

      {venueForComponents.booking_policy &&
        Object.keys(venueForComponents.booking_policy).length > 0 && (
          <>
            <Divider />
            <VenueBookingPolicy policy={venueForComponents.booking_policy} />
          </>
        )}

      <Divider />

      <Row className="mb-4">
        <Col span={24}>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Courts</h2>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate(`/court-owner/courts/create/${venueId}`)}
            >
              Add New Court
            </Button>
          </div>
        </Col>
      </Row>

      <VenueCourtsList courts={courts} />
    </Card>
  );
};

export default CourtOwnerVenueDetailView;

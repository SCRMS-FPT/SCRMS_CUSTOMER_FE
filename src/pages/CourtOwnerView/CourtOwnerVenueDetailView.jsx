import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Spin, Button } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import CourtOwnerSidebar from "@/components/CourtComponents/CourtOwnerSidebar";
import venuesData from "@/data/venue_mock_data";

import VenueOverview from "@/components/CourtOwnerVenueDetailView/VenueOverview";
import VenueDetails from "@/components/CourtOwnerVenueDetailView/VenueDetails";
import VenueOperatingHoursTable from "@/components/CourtOwnerVenueDetailView/VenueOperatingHoursTable";
import VenuePricingMembership from "@/components/CourtOwnerVenueDetailView/VenuePricingMembership";
import VenueBookingPolicy from "@/components/CourtOwnerVenueDetailView/VenueBookingPolicy";
import VenueCourtsList from "@/components/CourtOwnerVenueDetailView/VenueCourtsList";

const CourtOwnerVenueDetailView = () => {
  const { venueId } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🔍 venueId from URL:", venueId); // Debug log
    console.log("🏟 venuesData:", venuesData); // Debug log

    setTimeout(() => {
      const selectedVenue = venuesData.find((v) => v.id === venueId);
      console.log("🎯 Selected Venue:", selectedVenue); // Debug log
      setVenue(selectedVenue);
      setLoading(false);
    }, 500);
  }, [venueId]);

  if (loading) {
    return (
        <div className="flex justify-center items-center h-96">
          <Spin size="large" />
        </div>
    );
  }

  if (!venue) {
    return (
        <div className="flex justify-center items-center h-96">
          <p className="text-red-500 text-xl">Venue not found.</p>
        </div>
    );
  }

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
              Back to Venues
            </Button>
          </div>
        }
      >
        <VenueOverview venue={venue} />
        <VenueDetails venue={venue} />
        <VenueOperatingHoursTable operatingHours={venue.operating_hours} />
        <VenuePricingMembership pricing={venue.pricing_model} />
        <VenueBookingPolicy policy={venue.booking_policy} />
        <VenueCourtsList courts={venue.courts} />
      </Card>
  );
};

export default CourtOwnerVenueDetailView;

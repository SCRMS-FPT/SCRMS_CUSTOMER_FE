import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Form, message, Button, Spin } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import CourtOwnerSidebar from "@/components/CourtOwnerSidebar";
import venuesData from "@/data/venue_mock_data";

import VenueBasicForm from "@/components/CourtOwnerVenueCreateView/VenueBasicForm";
import VenueSportsAmenitiesForm from "@/components/CourtOwnerVenueCreateView/VenueSportsAmenitiesForm";
import VenueOperatingHoursForm from "@/components/CourtOwnerVenueCreateView/VenueOperatingHoursForm";
import VenuePricingForm from "@/components/CourtOwnerVenueCreateView/VenuePricingForm";
import VenueBookingPolicyForm from "@/components/CourtOwnerVenueCreateView/VenueBookingPolicyForm";
import VenueFormActions from "@/components/CourtOwnerVenueCreateView/VenueFormActions";

const CourtOwnerVenueUpdateView = () => {
  const { venueId } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const selectedVenue = venuesData.find((v) => v.id === venueId);
      if (selectedVenue) {
        setVenue(selectedVenue);
        form.setFieldsValue(selectedVenue); // Pre-fill form fields
      }
      setLoading(false);
    }, 100);
  }, [venueId, form]);

  const handleUpdate = (values) => {
    console.log("🎯 Venue Updated Data:", values);
    message.success("Venue updated successfully!");
    navigate("/court-owner/venues"); // Redirect after update
  };

  if (loading) {
    return (
      <CourtOwnerSidebar>
        <div className="flex justify-center items-center h-96">
          <Spin size="large" />
        </div>
      </CourtOwnerSidebar>
    );
  }

  if (!venue) {
    return (
      <CourtOwnerSidebar>
        <div className="flex justify-center items-center h-96">
          <p className="text-red-500 text-xl">Venue not found.</p>
        </div>
      </CourtOwnerSidebar>
    );
  }

  return (
    <CourtOwnerSidebar>
      <Card
        title={
          <div className="flex items-center">
            <Button
              type="link"
              icon={<LeftOutlined />}
              onClick={() => navigate("/court-owner/venues")}
              className="mr-2"
            >
              Back to Venue List
            </Button>
          </div>
        }
      >
        <div className="font-semibold text-2xl mb-4">Update Venue</div>
        <Form layout="vertical" form={form} onFinish={handleUpdate} initialValues={venue}>
          <VenueBasicForm />
          <VenueSportsAmenitiesForm />
          <VenueOperatingHoursForm />
          <VenuePricingForm />
          <VenueBookingPolicyForm />
          <VenueFormActions form={form} updateMode />
        </Form>
      </Card>
    </CourtOwnerSidebar>
  );
};

export default CourtOwnerVenueUpdateView;

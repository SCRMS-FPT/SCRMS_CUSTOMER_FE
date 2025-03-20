import React, { useState } from "react";
import { Card, Form, message, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { LeftOutlined } from "@ant-design/icons";
import CourtOwnerSidebar from "@/components/CourtOwnerSidebar";

import VenueBasicForm from "@/components/CourtOwnerVenueCreateView/VenueBasicForm";
import VenueSportsAmenitiesForm from "@/components/CourtOwnerVenueCreateView/VenueSportsAmenitiesForm";
import VenueOperatingHoursForm from "@/components/CourtOwnerVenueCreateView/VenueOperatingHoursForm";
import VenuePricingForm from "@/components/CourtOwnerVenueCreateView/VenuePricingForm";
import VenueBookingPolicyForm from "@/components/CourtOwnerVenueCreateView/VenueBookingPolicyForm";
import VenueFormActions from "@/components/CourtOwnerVenueCreateView/VenueFormActions";

const CourtOwnerVenueCreateView = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const handleSubmit = (values) => {
        console.log("🎯 Venue Data Submitted:", values);
        message.success("Venue created successfully!");
        navigate("/court-owner/venues"); // Redirect after successful submission
    };

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
                }>
                <div className="font-semibold text-2xl mb-4">Create New Venue</div>
                <Form layout="vertical" form={form} onFinish={handleSubmit}>
                    <VenueBasicForm />
                    <VenueSportsAmenitiesForm />
                    <VenueOperatingHoursForm />
                    <VenuePricingForm />
                    <VenueBookingPolicyForm />
                    <VenueFormActions form={form} />
                </Form>
            </Card>
        </CourtOwnerSidebar>
    );
};

export default CourtOwnerVenueCreateView;

import React from "react";
import { Card, Button, Tag, Statistic, Row, Col } from "antd";
import { 
    ArrowLeftOutlined, 
    EnvironmentOutlined, 
    CalendarOutlined, 
    ClockCircleOutlined 
} from "@ant-design/icons";

const CourtDetailsReport = ({ court, onBack }) => {
    if (!court) {
        return <p className="text-center text-gray-500">Loading court details...</p>;
    }

    return (
        <div className="p-4">
            {/* Back Button */}
            <Button 
                type="link" 
                icon={<ArrowLeftOutlined />} 
                onClick={onBack} 
                className="mb-4"
            >
                Back to Manage Courts
            </Button>

            {/* Court Details Card */}
            <Card title={court.name} className="shadow-lg">
                <Row gutter={[16, 16]}>
                    {/* City */}
                    <Col xs={24} sm={12} md={6}>
                        <Statistic 
                            title="City" 
                            value={court.city || "N/A"} 
                            prefix={<EnvironmentOutlined />} 
                        />
                    </Col>

                    {/* Availability */}
                    <Col xs={24} sm={12} md={6}>
                        <Statistic
                            title="Availability"
                            value={
                                court.availableHours?.start && court.availableHours?.end 
                                    ? `${court.availableHours.start} - ${court.availableHours.end}`
                                    : "N/A"
                            }
                            prefix={<ClockCircleOutlined />}
                        />
                    </Col>

                    {/* Status */}
                    <Col xs={24} sm={12} md={6}>
                        <Statistic title="Status" value={court.status || "N/A"} />
                    </Col>

                    {/* Price Per Hour */}
                    <Col xs={24} sm={12} md={6}>
                        <Statistic
                            title="Price Per Hour"
                            value={court.pricePerHour !== undefined ? `$${court.pricePerHour}` : "N/A"}
                            prefix="💰"
                        />
                    </Col>
                </Row>

                {/* Sports Available */}
                <div className="mt-4">
                    <h2 className="text-lg font-bold mb-2">Sports Available</h2>
                    <div className="flex gap-2">
                        {court.sport && court.sport.length > 0 ? (
                            court.sport.map((sport, index) => (
                                <Tag key={index} color="blue">{sport}</Tag>
                            ))
                        ) : (
                            <p className="text-gray-500">No sports listed</p>
                        )}
                    </div>
                </div>

                {/* Available Date Range */}
                <div className="mt-4">
                    <h2 className="text-lg font-bold mb-2">Available Date Range</h2>
                    <p>
                        {court.dateRange?.start && court.dateRange?.end 
                            ? `${court.dateRange.start} to ${court.dateRange.end}`
                            : "N/A"}
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default CourtDetailsReport;

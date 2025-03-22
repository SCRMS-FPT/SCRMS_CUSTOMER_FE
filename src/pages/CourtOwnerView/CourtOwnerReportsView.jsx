import React from "react";
import CourtOwnerSidebar from "@/components/CourtComponents/CourtOwnerSidebar";
import { Card, Statistic, Row, Col } from "antd";

const CourtOwnerReportsView = () => {
  return (
    <CourtOwnerSidebar>
      <Card title="Revenue & Reports">
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Statistic title="Total Revenue" value="$12,450" />
          </Col>
          <Col span={8}>
            <Statistic title="Total Bookings" value="234" />
          </Col>
          <Col span={8}>
            <Statistic title="Active Courts" value="5" />
          </Col>
        </Row>
      </Card>
    </CourtOwnerSidebar>
  );
};

export default CourtOwnerReportsView;

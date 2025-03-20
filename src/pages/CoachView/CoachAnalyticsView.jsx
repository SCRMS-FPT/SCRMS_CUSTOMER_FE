import React from "react";
import { Card, Statistic, Row, Col } from "antd";
import { BarChartOutlined } from "@ant-design/icons";
import CoachSidebar from "@/components/CoachSidebar";

const CoachAnalyticsView = () => {
  return (
    <CoachSidebar>
      <Card title="Coaching Analytics">
        <Row gutter={16}>
          <Col span={12}>
            <Statistic title="Average Rating" value="4.8" prefix={<BarChartOutlined />} />
          </Col>
          <Col span={12}>
            <Statistic title="Total Earnings" value="$12,500" prefix={<BarChartOutlined />} />
          </Col>
        </Row>
      </Card>
    </CoachSidebar>
  );
};

export default CoachAnalyticsView;

import React from "react";
import { Card, Statistic, Row, Col } from "antd";
import { BarChartOutlined } from "@ant-design/icons";

const CoachAnalyticsView = () => {
  return (
    <Card title="Coaching Analytics">
      <Row gutter={16}>
        <Col span={12}>
          <Statistic
            title="Average Rating"
            value="4.8"
            prefix={<BarChartOutlined />}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="Total Earnings"
            value="$12,500"
            prefix={<BarChartOutlined />}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default CoachAnalyticsView;

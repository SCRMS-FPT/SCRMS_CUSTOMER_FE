import { Card, Statistic, Row, Col, Table } from "antd";
import {
  DollarOutlined,
  TeamOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

const CoachDashboardView = () => {
  const summaryStats = [
    { title: "Total Earnings", value: "$5,200", icon: <DollarOutlined /> },
    { title: "Total Trainees", value: "38", icon: <TeamOutlined /> },
    { title: "Upcoming Sessions", value: "12", icon: <CalendarOutlined /> },
  ];

  return (
    <Card title="Coach Dashboard">
      <Row gutter={16}>
        {summaryStats.map((stat, index) => (
          <Col span={8} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.icon}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Table
        title={() => "Recent Sessions"}
        dataSource={[
          {
            key: "1",
            trainee: "John Doe",
            session: "Strength Training",
            date: "March 10",
          },
          {
            key: "2",
            trainee: "Jane Smith",
            session: "Speed Drills",
            date: "March 12",
          },
        ]}
        columns={[
          { title: "Trainee", dataIndex: "trainee" },
          { title: "Session", dataIndex: "session" },
          { title: "Date", dataIndex: "date" },
        ]}
      />
    </Card>
  );
};

export default CoachDashboardView;

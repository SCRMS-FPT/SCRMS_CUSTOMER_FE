import { useParams } from "react-router-dom";
import ReviewForm from "../components/ReviewForm";
import ReviewList from "../components/ReviewList";
import { Layout, Card } from "antd";

const Feedback = () => {
  const { courtId } = useParams();
  const token = localStorage.getItem("token");

  return (
    <Layout.Content className="p-4">
      <Card title="Court Feedback">
        <ReviewForm subjectType="court" subjectId={courtId} token={token} />
        <ReviewList subjectType="court" subjectId={courtId} />
      </Card>
    </Layout.Content>
  );
};

export default Feedback;

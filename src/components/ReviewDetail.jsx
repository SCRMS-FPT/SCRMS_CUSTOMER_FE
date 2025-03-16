import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviewDetail } from "../store/reviewSlice";
import { useParams } from "react-router-dom";
import { Card, Spin, Typography } from "antd";

const { Title, Paragraph } = Typography;

const ReviewDetail = () => {
  const { reviewId } = useParams();
  const dispatch = useDispatch();
  const { review, loading, error } = useSelector((state) => state.reviews);

  useEffect(() => {
    dispatch(fetchReviewDetail(reviewId));
  }, [dispatch, reviewId]);

  if (loading) return <Spin size="large" />;
  if (error) return <p>Error: {error}</p>;
  if (!review) return <p>No review found.</p>;

  return (
    <Card title="Review Details">
      <Title level={4}>{review.comment}</Title>
      <Paragraph>Rating: {review.rating} / 5</Paragraph>
      <Paragraph>Reviewer: {review.user?.firstName} {review.user?.lastName}</Paragraph>
      <Paragraph>Created At: {new Date(review.createdAt).toLocaleString()}</Paragraph>
    </Card>
  );
};

export default ReviewDetail;

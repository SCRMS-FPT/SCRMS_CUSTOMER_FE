import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchReviews } from "../store/reviewSlice";
import { List, Card, Spin, Alert } from "antd";

const ReviewList = ({ subjectType, subjectId }) => {
  const dispatch = useDispatch();
  
  // ✅ Ensure we safely access the state
  const { reviews = [], status, error } = useSelector((state) => state.reviews || {});

  useEffect(() => {
    if (subjectType && subjectId) {
      dispatch(fetchReviews({ subject_type: subjectType, subject_id: subjectId }));
    }
  }, [dispatch, subjectType, subjectId]);

  if (status === "loading") return <Spin tip="Loading reviews..." />;
  if (error) return <Alert message="Error fetching reviews" type="error" />;

  return (
    <List
      grid={{ gutter: 16, column: 1 }}
      dataSource={reviews}
      renderItem={(review) => (
        <List.Item>
          <Card title={`${review.rating} ⭐`} bordered>
            <p>{review.comment}</p>
            <small>{new Date(review.createdAt).toLocaleDateString()}</small>
          </Card>
        </List.Item>
      )}
    />
  );
};

export default ReviewList;

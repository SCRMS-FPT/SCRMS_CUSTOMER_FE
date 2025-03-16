import { useState } from "react";
import { useDispatch } from "react-redux";
import { Form, Input, Button, Rate, message } from "antd";
import { postReview } from "../store/reviewSlice"; // ✅ Now correctly imported
import { useParams } from "react-router-dom";

const ReviewForm = () => {
  const { courtId } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await dispatch(postReview({ subject_type: "court", subject_id: courtId, rating: values.rating, comment: values.comment })).unwrap();
      message.success("Review submitted successfully!");
    } catch (error) {
      message.error("Failed to submit review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form layout="vertical" onFinish={onFinish} className="p-4 bg-white shadow-md rounded-md">
      <Form.Item label="Rating" name="rating" rules={[{ required: true, message: "Please select a rating!" }]}>
        <Rate />
      </Form.Item>

      <Form.Item label="Comment" name="comment" rules={[{ required: true, message: "Please enter your comment!" }]}>
        <Input.TextArea rows={4} placeholder="Write your review..." />
      </Form.Item>

      <Button type="primary" htmlType="submit" loading={loading}>
        Submit Review
      </Button>
    </Form>
  );
};

export default ReviewForm;

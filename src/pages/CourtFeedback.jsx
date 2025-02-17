import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import FeedbackForm from "../components/FeedbackForm";

const CourtFeedback = () => {
  const { courtId } = useParams();
  const navigate = useNavigate();

  const [showFeedback, setShowFeedback] = useState(true);

  const onClose = () => {
    navigate(`/`);
  };

  return (
    <div>
      <FeedbackForm
        show={showFeedback}
        onClose={() => onClose()}
        title={`Đánh giá sân ${courtId}`}
      />
    </div>
  );
};

export default CourtFeedback;

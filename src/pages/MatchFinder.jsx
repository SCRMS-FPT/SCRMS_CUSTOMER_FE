import { useState } from "react";
import { motion } from "framer-motion";
import SearchBar from "../components/SearchBar.jsx";
import MatchList from "../components/MatchList.jsx";
import Notification from "../components/Notification.jsx";
import FeedbackForm from "../components/FeedbackForm.jsx";

const MatchFinder = () => {
  const [searchParams, setSearchParams] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);

  const handleSearch = (params) => {
    setSearchParams(params);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-6">Tìm kiếm đối thủ xứng tầm</h1>
      <Notification />
      <SearchBar onSearch={handleSearch} />
      <MatchList searchParams={searchParams} />
      <button
        onClick={() => setShowFeedback(true)}
        className="mt-8 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        Give Feedback
      </button>
      {/* <FeedbackForm
        show={showFeedback}
        onClose={() => setShowFeedback(false)}
      /> */}
    </motion.div>
  );
};

export default MatchFinder;

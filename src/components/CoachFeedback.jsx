import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

const CoachFeedback = ({ feedbacks, onAddFeedback }) => {
    const [newFeedback, setNewFeedback] = useState("");
    const [newRating, setNewRating] = useState(0);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newFeedback && newRating) {
            onAddFeedback({ text: newFeedback, rating: newRating });
            setNewFeedback("");
            setNewRating(0);
        }
    };

    const renderStars = (rating, setRating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <FaStar
                    key={i}
                    className={i <= rating ? "text-yellow-500 cursor-pointer text-2xl" : "text-gray-300 cursor-pointer text-2xl"}
                    onClick={() => setRating(i)}
                />
            );
        }
        return stars;
    };

    return (
        <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Feedback</h3>
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="flex items-center mb-2">
                    {renderStars(newRating, setNewRating)}
                </div>
                <textarea
                    value={newFeedback}
                    onChange={(e) => setNewFeedback(e.target.value)}
                    placeholder="Leave your feedback here..."
                    className="w-full p-2 border rounded mb-2"
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Submit
                </button>
            </form>
            <div>
                {feedbacks.length > 0 ? (
                    feedbacks.map((feedback, index) => (
                        <div key={index} className="mb-4 p-4 border rounded">
                            <div className="flex items-center mb-2">
                                {renderStars(feedback.rating)}
                                <span className="ml-2 text-gray-600">({feedback.rating})</span>
                            </div>
                            <p className="text-gray-700">{feedback.text}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No feedback yet.</p>
                )}
            </div>
        </div>
    );
};

export default CoachFeedback;
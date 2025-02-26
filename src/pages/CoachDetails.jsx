import React, { useState } from "react";
import { useParams } from "react-router-dom";
import coachesData from "../data/coachesData";
import CoachImageCarousel from "../components/CoachImageCarousel";
import CoachInfo from "../components/CoachInfo";
import CoachSpecialties from "../components/CoachSpecialties";
import CoachDescription from "../components/CoachDescription";
import CoachLocation from "../components/CoachLocation";
import CoachContact from "../components/CoachContact";
import CoachFeedback from "../components/CoachFeedback";

const CoachDetails = () => {
    const { id } = useParams(); // Get coach ID from URL
    const coach = coachesData.find(c => c.id === parseInt(id)); // Find coach by ID
    const [feedbacks, setFeedbacks] = useState([]);

    const handleAddFeedback = (feedback) => {
        setFeedbacks([...feedbacks, feedback]);
    };

    if (!coach) {
        return <div className="text-center text-red-500">Coach not found!</div>;
    }

    return (
        <div className="container mx-auto p-6 flex flex-col gap-6">
            {/* Title */}
            <h1 className="text-3xl font-bold mb-6">Chi tiết Huấn luyện viên</h1>

            {/* Top Section (Coach Details + Carousel) */}
            <div className="flex gap-6">
                <div className="w-5/8 bg-white shadow-md p-4 rounded-lg">
                    <CoachImageCarousel images={coach.image_details} name={coach.name} />
                    <CoachInfo
                        name={coach.name}
                        location={coach.location}
                        availableHours={coach.availableHours}
                        fee={coach.fee}
                        rating={coach.rating}
                    />
                    <CoachSpecialties specialties={coach.specialties} />
                    <CoachDescription description={coach.description} />
                    <CoachContact
                        email={coach.contact.email}
                        phone={coach.contact.phone}
                        website={coach.contact.website}
                    />
                </div>

                {/* Right Side (Google Maps Location) */}
                <div className="w-3/8 bg-white shadow-md p-4 rounded-lg">
                    <CoachLocation location={coach.location} />
                </div>
            </div>

            {/* Bottom Section (Feedback) */}
            <div className="bg-white shadow-md p-4 rounded-lg">
                <CoachFeedback feedbacks={feedbacks} onAddFeedback={handleAddFeedback} />
            </div>
        </div>
    );
};

export default CoachDetails;
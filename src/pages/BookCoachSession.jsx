import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import coachesData from "../data/coachesData";
import CoachTimeSlot from "../components/CoachTimeSlot";
import Payment from "../components/Payment";

const BookCoachSession = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const coach = coachesData.find(c => c.id === parseInt(id));
    const [selectedTime, setSelectedTime] = useState("");

    useEffect(() => {
        if (!coach) {
            navigate("/not-found");
        }
    }, [coach, navigate]);

    const handleBook = () => {
        alert("Payment successful! Your session is booked.");
        navigate(`/coach/${id}`);
    };

    if (!coach) {
        return <div className="text-center text-red-500">Coach not found!</div>;
    }

    return (
        <div className="container mx-auto p-6 flex flex-col gap-6">
            <h1 className="text-3xl font-bold mb-6">Đặt lịch huấn luyện viên {coach.name}</h1>
            <div className="bg-white shadow-md p-4 rounded-lg">
                <CoachTimeSlot availableHours={coach.availableHours} schedule={coach.schedule} selectedTime={selectedTime} setSelectedTime={setSelectedTime} />
                <Payment session={{ coach, selectedTime }} onBook={handleBook} />
            </div>
        </div>
    );
};

export default BookCoachSession;
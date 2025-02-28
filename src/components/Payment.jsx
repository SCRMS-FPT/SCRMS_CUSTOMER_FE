import React from "react";
import { FaUser, FaFutbol, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaDollarSign } from "react-icons/fa";

const Payment = ({ session, onBook }) => {
    return (
        <div className="bg-white shadow-md p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Payment Details</h2>
            <div className="flex items-center mb-2">
                <FaUser className="mr-2" />
                <p>Coach: {session.coach.name}</p>
            </div>
            <div className="flex items-center mb-2">
                <FaFutbol className="mr-2" />
                <p>Sport: {session.coach.sport}</p>
            </div>
            <div className="flex items-center mb-2">
                <FaMapMarkerAlt className="mr-2" />
                <p>Location: {session.coach.location}</p>
            </div>
            <div className="flex items-center mb-2">
                <FaCalendarAlt className="mr-2" />
                <p>Date: {session.coach.date}</p>
            </div>
            <div className="flex items-center mb-2">
                <FaClock className="mr-2" />
                <p>Time: {session.selectedTime}</p>
            </div>
            <div className="flex items-center mb-4">
                <FaDollarSign className="mr-2" />
                <p>Fee: ${session.coach.fee}</p>
            </div>
            <img src="/src/assets/HLV/qr.png" alt="QR Code for Payment" className="my-4 mx-auto" width="400" height="400" />
            <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded" onClick={onBook}>
                Confirm and Pay
            </button>
        </div>
    );
};

export default Payment;
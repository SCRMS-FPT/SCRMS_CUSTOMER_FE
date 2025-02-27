import React from "react";
import { FaEnvelope, FaPhone, FaGlobe } from "react-icons/fa";

const CoachContact = ({ email, phone, website }) => (
    <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="text-xl font-semibold mb-2">Contact Information</h3>
        <p className="text-gray-700 flex items-center gap-2">
            <FaEnvelope /> <span>{email}</span>
        </p>
        <p className="text-gray-700 flex items-center gap-2">
            <FaPhone /> <span>{phone}</span>
        </p>
        <p className="text-gray-700 flex items-center gap-2">
            <FaGlobe /> <span>{website}</span>
        </p>
    </div>
);

export default CoachContact;
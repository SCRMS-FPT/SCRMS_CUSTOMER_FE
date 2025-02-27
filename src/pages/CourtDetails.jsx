import React, { useState } from "react";
import { useParams } from "react-router-dom";
import courts from "../data/courtsData";
import ownersData from "../data/ownersData";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import DatePicker from "../components/CustomDatePicker";
import { FaMapMarkerAlt, FaClock, FaDollarSign, FaStar, FaImage } from "react-icons/fa";
import placeholderImage from "../assets/image_error.png";
import BookingModal from "../components/bookingModal";

const CourtDetails = () => {
    const { id } = useParams(); // Get court ID from URL
    const court = courts.find(c => c.id === id || c.id === parseInt(id)); // ✅ Ensure ID comparison works
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedDuration, setSelectedDuration] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const bookedSlots = {
        "Thu-11 AM": true,
        "Fri-2 PM": true,
        "Sat-3 PM": true,
    };

    if (!court) {
        return <div className="text-center text-red-500 font-bold text-xl">⚠️ Court not found!</div>;
    }

    const hasImages = court.image_details && court.image_details.length > 0;
    const owner = ownersData.find(o => o.id === court.ownerId);
    const googleMapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(court.address)}`;

    return (
        <div className="container mx-auto p-6 flex gap-6">
            {/* Left Side (Court Details + Carousel) */}
            <div className="w-5/8 bg-white shadow-md p-4 rounded-lg">
                {/* Image Carousel */}
                <div className="relative w-full h-96">
                    {hasImages ? (
                        <Swiper
                            modules={[Navigation, Pagination, Autoplay]}
                            navigation
                            pagination={{ clickable: true }}
                            autoplay={{ delay: 3000 }}
                            loop={true}
                            className="h-full"
                        >
                            {court.image_details.map((img, index) => (
                                <SwiperSlide key={index} className="flex justify-center items-center h-full">
                                    <img
                                        src={img}
                                        alt={court.name}
                                        className="w-full max-w-[800px] h-[400px] object-contain rounded-lg mx-auto"
                                        onError={(e) => (e.target.src = placeholderImage)}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full bg-gray-200 rounded-lg">
                            <FaImage className="text-gray-400 text-6xl" />
                            <p className="text-gray-500 mt-2">Image Unavailable</p>
                        </div>
                    )}
                </div>

                {/* Court Info */}
                <h2 className="text-2xl font-bold mt-4">{court.name}</h2>
                <p className="text-gray-600 flex items-center gap-2">
                    <FaMapMarkerAlt /> {court.city}, {court.address}
                </p>
                <p className="text-gray-600 flex items-center gap-2">
                    <FaClock /> Available: {court.availableHours.start} - {court.availableHours.end}
                </p>
                <p className="text-green-600 flex items-center gap-2">
                    <FaDollarSign /> <span className="font-semibold">{court.price}</span>
                </p>
                <p className="text-yellow-500 flex items-center gap-2">
                    <FaStar /> <span className="text-xl font-semibold">{court.rating}</span>
                </p>

                {/* Sport Tags */}
                <div className="flex gap-2 mt-2">
                    {court.sport.map((sport, index) => (
                        <span key={`sport-${index}`} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-sm">
                            {sport}
                        </span>
                    ))}
                </div>

                {/* Description Section */}
                <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                    <h3 className="text-xl font-semibold mb-2">Description</h3>
                    <p className="text-gray-700 leading-relaxed">{court.description || "No description available for this court."}</p>
                </div>

                {/* Contact Section */}
                <div className="mt-6 p-4 bg-white shadow-md rounded-lg border border-gray-200">
                    <h3 className="text-xl font-semibold mb-4 text-gray-900">Contact</h3>

                    {owner ? (
                        <>
                            <p className="text-gray-500">Club Manager</p>
                            <h4 className="text-lg font-medium text-gray-800">{owner.name}</h4>

                            <div className="grid grid-cols-2 gap-4 mt-2">
                                <div>
                                    <p className="text-gray-500">Email</p>
                                    <a href={`mailto:${owner.email}`} className="text-blue-600 hover:underline">
                                        {owner.email}
                                    </a>
                                </div>

                                <div>
                                    <p className="text-gray-500">Landline</p>
                                    <p className="text-gray-800 font-semibold">{owner.phone}</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <p className="text-gray-500">Contact information is not available.</p>
                    )}
                </div>
            </div>

            {/* Right Side (Datepicker + Booking) */}
            <div className="w-3/8 bg-white shadow-md p-4 rounded-lg">
                <h3 className="text-lg font-semibold">Book a Field on {court.name}</h3>
                <DatePicker selectedDate={selectedDate} onDateChange={setSelectedDate} />

                {/* Match Duration Options */}
                <h4 className="mt-4 text-md font-semibold">Match Duration</h4>
                <div className="flex gap-2 mt-2">
                    {court.durations.map((duration) => (
                        <button
                            key={duration}
                            onClick={() => setSelectedDuration(duration)}
                            className={`px-4 py-2 rounded-md border ${selectedDuration === duration ? "bg-green-600 text-white" : "bg-gray-100 text-gray-800"}`}
                        >
                            {duration} Mins
                        </button>
                    ))}
                </div>

                {/* Open Modal Button */}
                <button
                    className="mt-4 w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
                    onClick={() => setIsModalOpen(true)}
                >
                    Show Available Slots
                </button>

                {/* Booking Modal */}
                <BookingModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    slots={bookedSlots} // ✅ Fixed typo
                    onBook={(slot) => alert(`Booking confirmed for ${slot.time}`)}
                />

                {/* Google Maps Location */}
                <div className="mt-4">
                    <h4 className="text-md font-semibold mb-3">Location</h4>
                    <iframe
                        title="Court Location"
                        width="100%"
                        height="250"
                        className="rounded-lg border"
                        src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${encodeURIComponent(court.address)}`}
                        allowFullScreen
                    ></iframe>
                    <p className="mt-2 text-blue-600 underline">
                        <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                            View on Google Maps
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CourtDetails;

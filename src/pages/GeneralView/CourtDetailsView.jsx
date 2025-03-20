import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import courts from "../data/courtsData";
import ownersData from "../data/ownersData";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { motion } from "framer-motion";
import DatePicker from "../components/CustomDatePicker";
import { FaMapMarkerAlt, FaClock, FaDollarSign, FaStar, FaImage, 
         FaPhone, FaEnvelope, FaUser, FaInfoCircle, FaCalendarAlt, 
         FaArrowRight, FaInfo, FaList, FaAddressCard, FaMapMarked } from "react-icons/fa";
import placeholderImage from "../assets/image_error.png";
import bookedSchedule from "../data/bookedSchedule";

const CourtDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [court, setCourt] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedDuration, setSelectedDuration] = useState(null);
    const [activeTab, setActiveTab] = useState("details");
    
    useEffect(() => {
        // Simulating data fetch with timeout
        setTimeout(() => {
            const foundCourt = courts.find(c => c.id === id || c.id === parseInt(id));
            setCourt(foundCourt);
            setLoading(false);
            
            // Set default duration if available
            if (foundCourt && foundCourt.durations && foundCourt.durations.length > 0) {
                setSelectedDuration(foundCourt.durations[0]);
            }
        }, 600);
        
        // Scroll to top on component mount
        window.scrollTo(0, 0);
    }, [id]);
    
    if (loading) {
        return (
            <div className="container mx-auto p-6 min-h-screen">
                <div className="animate-pulse">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        <div className="h-64 lg:col-span-2 bg-gray-200 rounded-xl"></div>
                        <div className="h-96 bg-gray-200 rounded-xl"></div>
                    </div>
                    
                    <div className="lg:col-span-2">
                        <div className="flex gap-3 mb-4">
                            <div className="h-10 bg-gray-200 rounded-lg w-24"></div>
                            <div className="h-10 bg-gray-200 rounded-lg w-24"></div>
                            <div className="h-10 bg-gray-200 rounded-lg w-24"></div>
                        </div>
                        <div className="h-72 bg-gray-200 rounded-lg"></div>
                    </div>
                </div>
            </div>
        );
    }
    
    if (!court) {
        return (
            <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[50vh]">
                <div className="text-red-500 text-7xl mb-4">
                    <FaInfoCircle />
                </div>
                <h2 className="text-2xl font-bold mb-2">Court Not Found</h2>
                <p className="text-gray-600 mb-6">The court you're looking for doesn't exist or has been removed.</p>
                <button 
                    onClick={() => navigate("/")}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                >
                    Return to Home
                </button>
            </div>
        );
    }

    const hasImages = court.image_details && court.image_details.length > 0;
    const owner = ownersData.find(o => o.id === court.ownerId);
    const googleMapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(court.address)}`;
    
    // Calculate facilities dynamically from the court data
    const facilities = [
        { name: "Parking", available: true },
        { name: "Changing Rooms", available: court.hasChangingRooms || false },
        { name: "Showers", available: court.hasShowers || false },
        { name: "Floodlights", available: court.hasFloodlights || false },
        { name: "Spectator Area", available: court.hasSpectatorArea || false },
        { name: "Equipment Rental", available: court.hasEquipmentRental || false },
        { name: "Refreshments", available: court.hasRefreshments || false }
    ];

    // Calculate total price
    const calculatePrice = (duration, pricePerHour) => {
        if (!duration) return 0;
        return ((duration / 60) * pricePerHour).toFixed(2);
    };

    // Handle direct booking
    const handleDirectBooking = () => {
        if (!selectedDate || !selectedDuration) return;
        
        navigate(`/book-court/${court.id}`, {
            state: { 
                selectedDate,
                selectedDuration
            }
        });
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 py-6">
                {/* Top Section with Court Name and Sports Tags */}
                <div className="mb-6">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
                        {court.name}
                    </h1>
                    
                    {/* Sport Tags */}
                    <div className="flex flex-wrap gap-2">
                        {court.sport.map((sport, index) => (
                            <span 
                                key={`sport-${index}`} 
                                className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium"
                            >
                                {sport}
                            </span>
                        ))}
                    </div>
                </div>
                
                {/* Main Layout Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Left Column - Gallery and Tabs */}
                    <div className="lg:col-span-2 flex flex-col">
                        {/* Image Gallery */}
                        <div className="overflow-hidden rounded-xl shadow-md mb-6">
                            <div className="relative h-[35vh] md:h-[40vh]">
                                {hasImages ? (
                                    <Swiper
                                        modules={[Navigation, Pagination, Autoplay, EffectFade]}
                                        navigation
                                        pagination={{ clickable: true }}
                                        autoplay={{ delay: 4000 }}
                                        loop={true}
                                        effect="fade"
                                        className="h-full w-full"
                                    >
                                        {court.image_details.map((img, index) => (
                                            <SwiperSlide key={index}>
                                                <div className="relative w-full h-full">
                                                    <img
                                                        src={img}
                                                        alt={`${court.name} - Image ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => (e.target.src = placeholderImage)}
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                ) : (
                                    <div className="h-full w-full bg-gray-300 flex flex-col items-center justify-center">
                                        <FaImage className="text-gray-400 text-6xl mb-2" />
                                        <p className="text-gray-600">No images available</p>
                                    </div>
                                )}
                                
                                {/* Court Info Overlay */}
                                <div className="absolute bottom-0 left-0 w-full p-6 z-10">
                                    <div className="flex flex-wrap items-center gap-3 text-white text-sm">
                                        <div className="flex items-center">
                                            <FaMapMarkerAlt className="mr-1 text-red-400" />
                                            <span>{court.city}, {court.address}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <FaStar className="mr-1 text-yellow-400" />
                                            <span>{court.rating}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <FaDollarSign className="mr-1 text-green-400" />
                                            <span className="font-semibold">${court.pricePerHour}/hour</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Redesigned Tab Navigation */}
                        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                            <div className="flex justify-between overflow-x-auto no-scrollbar">
                                <button 
                                    onClick={() => setActiveTab("details")}
                                    className={`flex items-center justify-center px-4 py-2 rounded-lg transition-all ${
                                        activeTab === "details" 
                                            ? "bg-blue-600 text-white font-medium" 
                                            : "text-gray-600 hover:bg-gray-100"
                                    }`}
                                >
                                    <FaInfo className="mr-2" />
                                    <span>Details</span>
                                </button>
                                
                                <button 
                                    onClick={() => setActiveTab("facilities")}
                                    className={`flex items-center justify-center px-4 py-2 rounded-lg transition-all ${
                                        activeTab === "facilities" 
                                            ? "bg-blue-600 text-white font-medium" 
                                            : "text-gray-600 hover:bg-gray-100"
                                    }`}
                                >
                                    <FaList className="mr-2" />
                                    <span>Facilities</span>
                                </button>
                                
                                <button 
                                    onClick={() => setActiveTab("contact")}
                                    className={`flex items-center justify-center px-4 py-2 rounded-lg transition-all ${
                                        activeTab === "contact" 
                                            ? "bg-blue-600 text-white font-medium" 
                                            : "text-gray-600 hover:bg-gray-100"
                                    }`}
                                >
                                    <FaAddressCard className="mr-2" />
                                    <span>Contact</span>
                                </button>
                                
                                <button 
                                    onClick={() => setActiveTab("location")}
                                    className={`flex items-center justify-center px-4 py-2 rounded-lg transition-all ${
                                        activeTab === "location" 
                                            ? "bg-blue-600 text-white font-medium" 
                                            : "text-gray-600 hover:bg-gray-100"
                                    }`}
                                >
                                    <FaMapMarked className="mr-2" />
                                    <span>Location</span>
                                </button>
                            </div>
                        </div>
                        
                        {/* Tab Content */}
                        <div className="mb-6">
                            {/* Details Tab */}
                            {activeTab === "details" && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.4 }}
                                    className="bg-white rounded-xl shadow-sm p-6"
                                >
                                    <h2 className="text-xl font-bold mb-4">About this venue</h2>
                                    <p className="text-gray-700 leading-relaxed mb-4">
                                        {court.description || "No description available for this court."}
                                    </p>
                                    
                                    <h3 className="text-lg font-semibold mt-6 mb-3">Opening Hours</h3>
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <div className="flex items-center">
                                            <FaClock className="text-blue-600 mr-2" />
                                            <span className="text-gray-700">
                                                Available: <span className="font-medium">{court.availableHours.start} - {court.availableHours.end}</span>
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            
                            {/* Facilities Tab */}
                            {activeTab === "facilities" && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.4 }}
                                    className="bg-white rounded-xl shadow-sm p-6"
                                >
                                    <h2 className="text-xl font-bold mb-4">Facilities</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {facilities.map((facility, index) => (
                                            <div 
                                                key={index} 
                                                className={`flex items-center p-3 rounded-lg ${
                                                    facility.available 
                                                        ? "bg-green-50 text-green-800" 
                                                        : "bg-gray-50 text-gray-500"
                                                }`}
                                            >
                                                <div className={`w-4 h-4 rounded-full mr-3 ${
                                                    facility.available 
                                                        ? "bg-green-500" 
                                                        : "bg-gray-300"
                                                }`}></div>
                                                <span className={facility.available ? "font-medium" : ""}>
                                                    {facility.name}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <h3 className="text-lg font-semibold mt-8 mb-3">Court Features</h3>
                                    <div className="prose text-gray-700">
                                        <ul>
                                            <li>Court size: {court.courtSize || "Standard"}</li>
                                            <li>Surface type: {court.surfaceType || "All weather"}</li>
                                            <li>Indoor/Outdoor: {court.isIndoor ? "Indoor" : "Outdoor"}</li>
                                        </ul>
                                    </div>
                                </motion.div>
                            )}
                            
                            {/* Contact Tab */}
                            {activeTab === "contact" && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.4 }}
                                    className="bg-white rounded-xl shadow-sm p-6"
                                >
                                    <h2 className="text-xl font-bold mb-4">Contact Information</h2>
                                    
                                    {owner ? (
                                        <div>
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                                    <FaUser className="text-xl" />
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 text-sm">Club Manager</p>
                                                    <h4 className="text-lg font-medium text-gray-800">{owner.name}</h4>
                                                </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
                                                            <FaEnvelope />
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-500 text-sm">Email</p>
                                                            <a href={`mailto:${owner.email}`} className="text-blue-600 hover:underline">
                                                                {owner.email}
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white">
                                                            <FaPhone />
                                                        </div>
                                                        <div>
                                                            <p className="text-gray-500 text-sm">Landline</p>
                                                            <p className="text-gray-800 font-semibold">{owner.phone}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="bg-blue-50 p-4 rounded-lg mt-6">
                                                <p className="text-gray-700">
                                                    <span className="font-medium">Response time:</span> Usually responds within a few hours
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 mb-3">
                                                <FaInfoCircle className="text-2xl" />
                                            </div>
                                            <p className="text-gray-500">Contact information is not available.</p>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                            
                            {/* Location Tab */}
                            {activeTab === "location" && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.4 }}
                                    className="bg-white rounded-xl shadow-sm p-6"
                                >
                                    <h2 className="text-xl font-bold mb-4">Location</h2>
                                    <div className="mb-4">
                                        <p className="text-gray-700 flex items-center mb-2">
                                            <FaMapMarkerAlt className="text-red-500 mr-2" />
                                            {court.address}, {court.city}
                                        </p>
                                    </div>
                                    
                                    <div className="rounded-lg overflow-hidden shadow-md">
                                        <iframe
                                            title="Court Location"
                                            width="100%"
                                            height="400"
                                            className="border-0"
                                            src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${encodeURIComponent(court.address)}`}
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                    
                                    <div className="flex justify-center mt-4">
                                        <a 
                                            href={googleMapsUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-blue-600 flex items-center hover:underline"
                                        >
                                            <span>Open in Google Maps</span>
                                        </a>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                    
                    {/* Right Column - Booking Widget */}
                    <div>
                        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
                            <h3 className="text-xl font-bold mb-4">Book this venue</h3>
                            
                            <div className="mb-5">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-gray-700 font-medium">Price</span>
                                    <span className="text-2xl font-bold text-green-600">${court.pricePerHour}</span>
                                </div>
                                <p className="text-gray-500 text-sm">Per hour</p>
                            </div>
                            
                            <div className="mb-5">
                                <label className="block text-gray-700 font-medium mb-2">
                                    <div className="flex items-center">
                                        <FaCalendarAlt className="mr-2 text-blue-600" />
                                        Select date
                                    </div>
                                </label>
                                <DatePicker 
                                    selectedDate={selectedDate} 
                                    onDateChange={setSelectedDate} 
                                />
                            </div>
                            
                            <div className="mb-5">
                                <label className="block text-gray-700 font-medium mb-2">
                                    <div className="flex items-center">
                                        <FaClock className="mr-2 text-blue-600" />
                                        Duration
                                    </div>
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {court.durations.map((duration) => (
                                        <button
                                            key={duration}
                                            onClick={() => setSelectedDuration(duration)}
                                            className={`px-4 py-2 rounded-lg border transition-all ${
                                                selectedDuration === duration 
                                                    ? "bg-blue-600 text-white border-blue-600" 
                                                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                                            }`}
                                        >
                                            {duration} Mins
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Total Price Display */}
                            {selectedDuration && (
                                <div className="mb-5 bg-gray-50 p-4 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-700">Total price:</span>
                                        <span className="text-xl font-bold text-green-600">
                                            ${calculatePrice(selectedDuration, court.pricePerHour)}
                                        </span>
                                    </div>
                                </div>
                            )}
                            
                            {/* Direct Booking Button */}
                            <button
                                className="w-full py-3 px-4 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-all flex justify-center items-center gap-2"
                                onClick={handleDirectBooking}
                                disabled={!selectedDate || !selectedDuration}
                            >
                                <span>Book Now</span>
                                <FaArrowRight />
                            </button>
                            
                            <p className="text-center text-gray-500 text-sm mt-3">
                                You won't be charged yet
                            </p>
                            
                            {/* Availability Info */}
                            <div className="mt-5 pt-4 border-t border-gray-200">
                                <div className="flex items-center mb-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                    <span className="text-sm text-gray-600">High availability today</span>
                                </div>
                                <div className="text-sm text-gray-500">
                                    This venue is typically booked {court.popularTimes || "7"} times per day
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourtDetails;

import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    FaArrowLeft, FaCalendarAlt, FaClock, FaCreditCard, FaCheck,
    FaInfoCircle, FaTableTennis, FaMapMarkerAlt, FaLightbulb, FaWifi
} from "react-icons/fa";
import DatePicker from "../components/CustomDaatePicker";
import formatDate from "../utils/formatDate";

const BookCourt = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    // Court data from API
    const [courts, setCourts] = useState([]);
    const [selectedCourtId, setSelectedCourtId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Booking states
    const [selectedDate, setSelectedDate] = useState(
        location.state?.selectedDate || new Date()
    );
    const [availableSlotsMap, setAvailableSlotsMap] = useState({});
    const [selectedTimeSlots, setSelectedTimeSlots] = useState({});

    // Contact information
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [notes, setNotes] = useState("");

    // UI states
    const [currentStep, setCurrentStep] = useState(1);
    const [datePickerVisible, setDatePickerVisible] = useState(true);

    // Fetch court data and available slots
    useEffect(() => {
        const fetchCourts = async () => {
            try {
                setLoading(true);
                // Mock API response - now returning an array of courts
                const courtsData = [
                    {
                        "id": "e6e10ea7-2dc2-4700-b59a-7cf85036487e",
                        "courtName": "Court 1",
                        "sportId": "16d686e5-3c4b-4bb9-8f74-b5b42956c9b4",
                        "sportCenterId": "a735b48c-a177-43d9-b467-4e2543f1dfd3",
                        "description": "Main tennis court with professional surface",
                        "facilities": [
                            { "name": "WiFi", "description": "High-speed internet" },
                            { "name": "Lighting", "description": "Bright LED lights" }
                        ],
                        "slotDuration": "00:30:00",
                        "status": 0,
                        "courtType": 1,
                        "minDepositPercentage": 0,
                        "sportName": "Tennis",
                        "sportCenterName": "Sport Center 1",
                        "createdAt": "2025-03-19T21:03:39.405585Z",
                        "lastModified": null,
                        "price": 25,
                        "pricePerHour": 50,
                        "address": "123 Sports Way, Tennis City",
                        "maxPeople": 4
                    },
                    {
                        "id": "f7e10ea7-2dc2-4700-b59a-7cf85036488f",
                        "courtName": "Court 2",
                        "sportId": "16d686e5-3c4b-4bb9-8f74-b5b42956c9b4",
                        "sportCenterId": "a735b48c-a177-43d9-b467-4e2543f1dfd3",
                        "description": "Secondary tennis court with clay surface",
                        "facilities": [
                            { "name": "WiFi", "description": "High-speed internet" },
                            { "name": "Lighting", "description": "Bright LED lights" },
                            { "name": "Showers", "description": "Clean shower facilities" }
                        ],
                        "slotDuration": "00:30:00",
                        "status": 0,
                        "courtType": 2,
                        "minDepositPercentage": 0,
                        "sportName": "Tennis",
                        "sportCenterName": "Sport Center 1",
                        "createdAt": "2025-03-19T21:03:39.405585Z",
                        "lastModified": null,
                        "price": 20,
                        "pricePerHour": 40,
                        "address": "123 Sports Way, Tennis City",
                        "maxPeople": 4
                    },
                    {
                        "id": "g8e10ea7-2dc2-4700-b59a-7cf85036489g",
                        "courtName": "Court 3",
                        "sportId": "16d686e5-3c4b-4bb9-8f74-b5b42956c9b4",
                        "sportCenterId": "a735b48c-a177-43d9-b467-4e2543f1dfd3",
                        "description": "Indoor tennis court with premium surface",
                        "facilities": [
                            { "name": "WiFi", "description": "High-speed internet" },
                            { "name": "Lighting", "description": "Bright LED lights" },
                            { "name": "Air Conditioning", "description": "Climate controlled environment" }
                        ],
                        "slotDuration": "00:30:00",
                        "status": 0,
                        "courtType": 3,
                        "minDepositPercentage": 0,
                        "sportName": "Tennis",
                        "sportCenterName": "Sport Center 1",
                        "createdAt": "2025-03-19T21:03:39.405585Z",
                        "lastModified": null,
                        "price": 30,
                        "pricePerHour": 60,
                        "address": "123 Sports Way, Tennis City",
                        "maxPeople": 4
                    },
                    {
                        "id": "h9e10ea7-2dc2-4700-b59a-7cf85036490h",
                        "courtName": "Court 4",
                        "sportId": "16d686e5-3c4b-4bb9-8f74-b5b42956c9b4",
                        "sportCenterId": "a735b48c-a177-43d9-b467-4e2543f1dfd3",
                        "description": "Outdoor tennis court with standard surface",
                        "facilities": [
                            { "name": "Lighting", "description": "Bright LED lights" },
                            { "name": "Seating", "description": "Spectator seating available" }
                        ],
                        "slotDuration": "00:30:00",
                        "status": 0,
                        "courtType": 1,
                        "minDepositPercentage": 0,
                        "sportName": "Tennis",
                        "sportCenterName": "Sport Center 1",
                        "createdAt": "2025-03-19T21:03:39.405585Z",
                        "lastModified": null,
                        "price": 22,
                        "pricePerHour": 44,
                        "address": "123 Sports Way, Tennis City",
                        "maxPeople": 4
                    }
                ];

                setCourts(courtsData);

                // Generate time slots for all courts at once
                const slotsMap = {};
                courtsData.forEach(court => {
                    slotsMap[court.id] = generateTimeSlotsForCourt(court);
                });

                setAvailableSlotsMap(slotsMap);

                // Set the first court as default selected court
                if (courtsData.length > 0) {
                    setSelectedCourtId(courtsData[0].id);
                }

                setLoading(false);
            } catch (err) {
                setError("Failed to load court details. Please try again later.");
                setLoading(false);
            }
        };

        fetchCourts();
    }, [id]);

    // Create a function to generate time slots for a specific court
    const generateTimeSlotsForCourt = (court) => {
        // In real app, this would be fetched from backend
        const startHour = 8; // 8 AM
        const endHour = 22; // 10 PM
        const slotInterval = 30; // 30 minutes

        const slots = [];
        for (let hour = startHour; hour < endHour; hour++) {
            for (let minute = 0; minute < 60; minute += slotInterval) {
                const hourFormatted = hour.toString().padStart(2, '0');
                const minuteFormatted = minute.toString().padStart(2, '0');

                // Calculate end time
                let endHour = hour;
                let endMinute = minute + slotInterval;

                if (endMinute >= 60) {
                    endHour += 1;
                    endMinute -= 60;
                }

                const endHourFormatted = endHour.toString().padStart(2, '0');
                const endMinuteFormatted = endMinute.toString().padStart(2, '0');

                const time = `${hourFormatted}:${minuteFormatted}`;
                const endTime = `${endHourFormatted}:${endMinuteFormatted}`;
                const displayTime = `${hourFormatted}:${minuteFormatted} - ${endHourFormatted}:${endMinuteFormatted}`;

                // Random availability for demo - unique to this court
                // In a real app, this would be based on court's actual bookings
                const isAvailable = Math.random() > (court.courtName === "Court 1" ? 0.4 :
                    court.courtName === "Court 2" ? 0.3 :
                        court.courtName === "Court 3" ? 0.2 : 0.1);

                slots.push({
                    time,
                    endTime,
                    displayTime,
                    isAvailable,
                    slotIndex: slots.length,
                    courtId: court.id // Attach the court ID to the slot
                });
            }
        }

        return slots;
    };

    // Modify the useEffect for date changes to regenerate all time slots
    useEffect(() => {
        if (courts.length > 0) {
            // When date changes, regenerate slots for all courts
            const slotsMap = {};
            courts.forEach(court => {
                slotsMap[court.id] = generateTimeSlotsForCourt(court);
            });

            setAvailableSlotsMap(slotsMap);

            // Clear selected time slots when date changes
            setSelectedTimeSlots([]);
        }
    }, [selectedDate, courts]);

    // Add a function to handle toggling time slot selection
    const toggleTimeSlot = (slot) => {
        if (!slot.isAvailable) return;

        setSelectedTimeSlots(prevSlots => {
            const newSlots = { ...prevSlots };

            // Initialize court array if it doesn't exist
            if (!newSlots[slot.courtId]) {
                newSlots[slot.courtId] = [];
            }

            // Check if slot is already selected for this court
            const courtSlots = newSlots[slot.courtId];
            const slotIndex = courtSlots.findIndex(s => s.time === slot.time);

            if (slotIndex >= 0) {
                // Remove slot if already selected
                courtSlots.splice(slotIndex, 1);
                // Remove court entirely if no slots left
                if (courtSlots.length === 0) {
                    delete newSlots[slot.courtId];
                }
            } else {
                // Add slot, maintaining chronological order
                courtSlots.push(slot);
                courtSlots.sort((a, b) => a.time.localeCompare(b.time));
            }

            return newSlots;
        });
    };

    // Calculate subtotal
    const calculateSubtotal = () => {
        let total = 0;

        Object.entries(selectedTimeSlots).forEach(([courtId, slots]) => {
            const court = courts.find(c => c.id === courtId);
            if (court) {
                // Each slot is 30 minutes (0.5 hours)
                total += (slots.length * 0.5) * court.pricePerHour;
            }
        });

        return total;
    };

    // Calculate taxes (example: 10%)
    const calculateTaxes = () => {
        return calculateSubtotal() * 0.1;
    };

    // Calculate total
    const calculateTotal = () => {
        return calculateSubtotal() + calculateTaxes();
    };

    // Handle booking submission
    const handleBooking = async (e) => {
        e.preventDefault();

        const selectedCourt = getSelectedCourt();
        if (!selectedDate || selectedTimeSlots.length === 0 || !firstName || !lastName || !email || !phone || !selectedCourt) {
            return;
        }

        // In a real app, this would be an API call to create the booking
        // For demo purposes, show success and navigate

        // Mock API call
        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Navigate to success page
            navigate('/booking-success', {
                state: {
                    bookingId: 'BK' + Math.random().toString(36).substr(2, 9).toUpperCase(),
                    courtName: selectedCourt.courtName,
                    sportCenter: selectedCourt.sportCenterName,
                    date: selectedDate,
                    timeSlots: selectedTimeSlots,
                    totalMinutes: selectedTimeSlots.length * 30,
                    total: calculateTotal()
                }
            });
        } catch (error) {
            setError("Failed to complete booking. Please try again.");
        }
    };

    // Next step
    const goToNextStep = () => {
        // Check if any courts have been selected
        if (currentStep === 1 && Object.keys(selectedTimeSlots).length === 0) {
            return;
        }

        setCurrentStep(currentStep + 1);
    };

    // Previous step
    const goToPreviousStep = () => {
        setCurrentStep(currentStep - 1);
    };

    // Get the currently selected court
    const getSelectedCourt = () => {
        return courts.find(court => court.id === selectedCourtId) || null;
    };

    // Get available slots for the current court
    const getAvailableSlotsForSelectedCourt = () => {
        return availableSlotsMap[selectedCourtId] || [];
    };

    // Clear selected time slots when date changes
    useEffect(() => {
        if (courts.length > 0) {
            // When date changes, regenerate slots for all courts
            const slotsMap = {};
            courts.forEach(court => {
                slotsMap[court.id] = generateTimeSlotsForCourt(court);
            });

            setAvailableSlotsMap(slotsMap);

            // Clear selected time slots when date changes
            setSelectedTimeSlots({});
        }
    }, [selectedDate, courts]);

    // Update the handle court select function
    const handleCourtSelect = (courtId) => {
        setSelectedCourtId(courtId);
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-10">
                <div className="animate-pulse">
                    <div className="h-10 bg-gray-200 rounded-lg w-1/2 mb-6"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-4">
                            <div className="h-64 bg-gray-200 rounded-lg"></div>
                            <div className="h-40 bg-gray-200 rounded-lg"></div>
                        </div>
                        <div className="h-96 bg-gray-200 rounded-lg"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !courts.length) {
        return (
            <div className="container mx-auto px-4 py-10 flex flex-col items-center justify-center min-h-[60vh]">
                <FaInfoCircle className="text-6xl text-red-500 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Error Loading Court</h2>
                <p className="text-gray-600 mb-6">{error || "Court information not found."}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                >
                    Return to Previous Page
                </button>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 py-6">
                {/* Header with back button */}
                <div className="mb-6 flex items-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-gray-600 hover:text-gray-800 transition-colors mr-4"
                    >
                        <FaArrowLeft className="text-lg" />
                    </button>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                        Book {getSelectedCourt()?.courtName} - {getSelectedCourt()?.sportName}
                    </h1>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center mb-8">
                    <div className="relative flex items-center w-full max-w-3xl mx-auto">
                        {/* Step 1 */}
                        <div className={`relative flex flex-col items-center z-10 ${currentStep >= 1 ? "text-white" : "text-gray-500"}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                                ${currentStep >= 1 ? "bg-blue-600" : "bg-gray-200"}`}>
                                <FaCalendarAlt />
                            </div>
                            <span className="text-sm mt-1 font-medium text-gray-700">Select Time</span>
                        </div>

                        {/* Line */}
                        <div className={`h-1 flex-1 mx-2 ${currentStep >= 2 ? "bg-blue-600" : "bg-gray-200"}`}></div>

                        {/* Step 2 */}
                        <div className={`relative flex flex-col items-center z-10 ${currentStep >= 2 ? "text-white" : "text-gray-500"}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                                ${currentStep >= 2 ? "bg-blue-600" : "bg-gray-200"}`}>
                                <FaInfoCircle />
                            </div>
                            <span className="text-sm mt-1 font-medium text-gray-700">Your Info</span>
                        </div>

                        {/* Line */}
                        <div className={`h-1 flex-1 mx-2 ${currentStep >= 3 ? "bg-blue-600" : "bg-gray-200"}`}></div>

                        {/* Step 3 */}
                        <div className={`relative flex flex-col items-center z-10 ${currentStep >= 3 ? "text-white" : "text-gray-500"}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                                ${currentStep >= 3 ? "bg-blue-600" : "bg-gray-200"}`}>
                                <FaCreditCard />
                            </div>
                            <span className="text-sm mt-1 font-medium text-gray-700">Payment</span>
                        </div>
                    </div>
                </div>

                {/* Main Content - 2 columns */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Left Column - Steps content */}
                    <div className="lg:col-span-2">
                        {/* Step 1 - Select Date & Time */}
                        {currentStep === 1 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className="bg-white rounded-xl shadow-sm p-6"
                            >
                                <h2 className="text-xl font-bold mb-6">
                                    Select Date & Time
                                </h2>

                                {/* Date Selection */}
                                <div className="mb-6">
                                    <label className="block text-gray-700 font-medium mb-2">
                                        <div className="flex items-center">
                                            <FaCalendarAlt className="mr-2 text-blue-600" />
                                            Select date
                                        </div>
                                    </label>

                                    {datePickerVisible ? (
                                        <div>
                                            <DatePicker
                                                selectedDate={selectedDate}
                                                onDateChange={(date) => {
                                                    setSelectedDate(date);
                                                    setDatePickerVisible(false);
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div
                                            className="flex items-center justify-between border border-gray-300 rounded-lg px-4 py-3 bg-blue-50 cursor-pointer hover:border-blue-400 transition-colors"
                                            onClick={() => setDatePickerVisible(true)}
                                        >
                                            <div className="flex items-center">
                                                <FaCalendarAlt className="text-blue-600 mr-2" />
                                                <span className="font-medium">{formatDate(selectedDate)}</span>
                                            </div>
                                            <button
                                                className="text-blue-600 hover:text-blue-800"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setDatePickerVisible(true);
                                                }}
                                            >
                                                Change
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Court Selection */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-medium mb-3">
                                        Court Selection
                                    </h3>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {courts.map((court) => (
                                            <button
                                                key={court.id}
                                                onClick={() => handleCourtSelect(court.id)}
                                                className={`
                                                    h-20 rounded-lg border-2 flex flex-col items-center justify-center
                                                    transition-all ${selectedCourtId === court.id
                                                        ? "border-blue-600 bg-blue-50"
                                                        : "border-gray-200 hover:border-blue-300"
                                                    }
                                                `}
                                            >
                                                <span className="text-xl font-semibold mb-1">
                                                    {court.courtName}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    ${court.pricePerHour}/hour
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Time Slot Selection */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-medium mb-3">
                                        Available Time Slots
                                    </h3>
                                    <p className="text-gray-500 mb-3">
                                        Selected Date: <span className="font-medium">{formatDate(selectedDate)}</span>
                                    </p>
                                    <p className="text-gray-500 mb-3">
                                        <span className="font-medium">Select multiple slots</span> for longer booking durations
                                    </p>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                        {getAvailableSlotsForSelectedCourt().map((slot, index) => (
                                            <button
                                                key={index}
                                                onClick={() => toggleTimeSlot(slot)}
                                                disabled={!slot.isAvailable}
                                                className={`
                                                py-2 px-3 rounded-lg text-center 
                                                transition-all ${!slot.isAvailable
                                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                        : selectedTimeSlots[slot.courtId]?.some(s => s.time === slot.time)
                                                            ? "bg-blue-600 text-white"
                                                            : "bg-white border border-gray-200 hover:border-blue-300"
                                                    }
                                            `}
                                            >
                                                {slot.displayTime}
                                            </button>
                                        ))}
                                    </div>

                                    {Object.keys(selectedTimeSlots).length > 0 && (
                                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                            <div className="font-medium mb-1">Selected Time Slots:</div>
                                            {Object.entries(selectedTimeSlots).map(([courtId, slots]) => {
                                                const court = courts.find(c => c.id === courtId);
                                                return (
                                                    <div key={courtId} className="mb-3">
                                                        <div className="font-medium text-blue-700 mb-1">
                                                            {court.courtName}:
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {slots.map((slot, index) => (
                                                                <div key={index} className="bg-white border border-blue-200 rounded-md px-2 py-1 text-sm flex items-center">
                                                                    {slot.displayTime}
                                                                    <button
                                                                        onClick={() => toggleTimeSlot(slot)}
                                                                        className="ml-2 text-gray-400 hover:text-red-500"
                                                                    >
                                                                        &times;
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            <div className="mt-2 text-sm text-blue-700">
                                                Total courts: {Object.keys(selectedTimeSlots).length}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Continue Button */}
                                <div className="mt-8">
                                    <button
                                        onClick={goToNextStep}
                                        disabled={selectedTimeSlots.length === 0}
                                        className={`
                                            w-full md:w-auto py-3 px-6 rounded-lg font-medium
                                            ${selectedTimeSlots.length === 0
                                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                : "bg-blue-600 text-white hover:bg-blue-700"
                                            }
                                        `}
                                    >
                                        Continue to Your Information
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2 - Contact Information */}
                        {currentStep === 2 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className="bg-white rounded-xl shadow-sm p-6"
                            >
                                <h2 className="text-xl font-bold mb-6">
                                    Your Information
                                </h2>

                                <form onSubmit={(e) => { e.preventDefault(); goToNextStep(); }}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2" htmlFor="firstName">
                                                First Name
                                            </label>
                                            <input
                                                type="text"
                                                id="firstName"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2" htmlFor="lastName">
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                id="lastName"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2" htmlFor="phone">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-gray-700 font-medium mb-2" htmlFor="notes">
                                            Special Requests (Optional)
                                        </label>
                                        <textarea
                                            id="notes"
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            rows="3"
                                        ></textarea>
                                    </div>

                                    <div className="flex items-center justify-between mt-8">
                                        <button
                                            type="button"
                                            onClick={goToPreviousStep}
                                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                        >
                                            Back
                                        </button>

                                        <button
                                            type="submit"
                                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                        >
                                            Continue to Payment
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {/* Step 3 - Payment */}
                        {currentStep === 3 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                className="bg-white rounded-xl shadow-sm p-6"
                            >
                                <h2 className="text-xl font-bold mb-6">
                                    Payment Details
                                </h2>

                                <form onSubmit={handleBooking}>
                                    <div className="p-4 bg-blue-50 rounded-lg mb-6">
                                        <div className="flex items-center text-blue-800">
                                            <FaInfoCircle className="mr-2" />
                                            <p className="text-sm">
                                                Payment will be processed at the venue. This booking reserves your spot.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200 pt-6 mb-6">
                                        <h3 className="text-lg font-medium mb-4">
                                            Booking Summary
                                        </h3>

                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Date:</span>
                                                <span className="font-medium">{formatDate(selectedDate)}</span>
                                            </div>

                                            <div className="flex flex-col">
                                                <div className="flex justify-between mb-1">
                                                    <span className="text-gray-600">Time Slots:</span>
                                                    <span className="font-medium">{selectedTimeSlots.length} slots</span>
                                                </div>
                                                <div className="bg-gray-50 p-2 rounded-md text-sm">
                                                    {selectedTimeSlots.map((slot, index) => (
                                                        <div key={index} className="flex justify-between py-1 border-b last:border-0 border-gray-100">
                                                            <span>{index + 1}.</span>
                                                            <span>{slot.displayTime}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Total Duration:</span>
                                                <span className="font-medium">{selectedTimeSlots.length * 30} minutes</span>
                                            </div>

                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Court:</span>
                                                <span className="font-medium">{getSelectedCourt()?.courtName}</span>
                                            </div>

                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Sport Center:</span>
                                                <span className="font-medium">{getSelectedCourt()?.sportCenterName}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200 pt-4 mb-6">
                                        <div className="flex justify-between mb-2">
                                            <span className="text-gray-600">Subtotal:</span>
                                            <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
                                        </div>

                                        <div className="flex justify-between mb-2">
                                            <span className="text-gray-600">Taxes (10%):</span>
                                            <span className="font-medium">${calculateTaxes().toFixed(2)}</span>
                                        </div>

                                        <div className="flex justify-between text-lg font-bold">
                                            <span>Total:</span>
                                            <span>${calculateTotal().toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <div className="border rounded-lg p-4 mb-6">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                                                required
                                            />
                                            <span className="ml-2 text-sm text-gray-700">
                                                I agree to the <a href="#" className="text-blue-600 hover:underline">Terms and Conditions</a> and <a href="#" className="text-blue-600 hover:underline">Cancellation Policy</a>
                                            </span>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between mt-8">
                                        <button
                                            type="button"
                                            onClick={goToPreviousStep}
                                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                        >
                                            Back
                                        </button>

                                        <button
                                            type="submit"
                                            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                                        >
                                            Complete Booking
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}
                    </div>

                    {/* Right Column - Court Info */}
                    <div>
                        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
                            {/* Sport Center Info */}
                            <div className="mb-5">
                                <h3 className="text-lg font-bold border-b pb-2 mb-3">Sport Center Info</h3>
                                <div className="flex items-start mb-3">
                                    <FaMapMarkerAlt className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                                    <div>
                                        <p className="text-gray-800 font-medium">{getSelectedCourt()?.sportCenterName}</p>
                                        <p className="text-gray-600 text-sm">{getSelectedCourt()?.address}</p>
                                    </div>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <FaInfoCircle className="mr-2 text-blue-500" />
                                    <p>Court operated by Sport Center 1</p>
                                </div>
                            </div>

                            {/* Selected Court Info */}
                            {/* <div className="border-t pt-4 mb-5">
                                <h3 className="text-lg font-bold mb-3">Selected Court</h3>
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3 flex-shrink-0">
                                        <FaTableTennis className="text-xl" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold">{getSelectedCourt()?.courtName}</h4>
                                        <p className="text-gray-600">{getSelectedCourt()?.sportName}</p>
                                    </div>
                                </div>

                                <div className="text-sm text-gray-700 mb-3">
                                    {getSelectedCourt()?.description}
                                </div>

                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-gray-600">Price per hour:</span>
                                    <span className="font-bold text-gray-800">${getSelectedCourt()?.pricePerHour}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Maximum people:</span>
                                    <span className="font-medium text-gray-800">{getSelectedCourt()?.maxPeople}</span>
                                </div>
                            </div> */}

                            {/* Court Facilities */}
                            {/* <div className="border-t border-gray-100 pt-4 pb-2 mb-4">
                                <h4 className="font-medium mb-3">Court Facilities:</h4>
                                <ul className="space-y-2">
                                    {getSelectedCourt()?.facilities.map((facility, index) => (
                                        <li key={index} className="flex items-center">
                                            {facility.name === "WiFi" ? (
                                                <FaWifi className="text-blue-500 mr-2 flex-shrink-0" />
                                            ) : facility.name === "Lighting" ? (
                                                <FaLightbulb className="text-yellow-500 mr-2 flex-shrink-0" />
                                            ) : (
                                                <FaCheck className="text-green-500 mr-2 flex-shrink-0" />
                                            )}
                                            <span className="text-gray-700">{facility.name} - {facility.description}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div> */}

                            {/* Booking Summary */}
                            {Object.keys(selectedTimeSlots).length > 0 && (
                                <div className="border-t pt-4">
                                    <h3 className="text-lg font-bold mb-3">Booking Summary</h3>

                                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                                        <div className="mb-2">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-gray-700 font-medium">Date:</span>
                                                <span className="text-gray-800">{formatDate(selectedDate)}</span>
                                            </div>

                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-gray-700 font-medium">Total courts:</span>
                                                <span className="text-gray-800">{Object.keys(selectedTimeSlots).length}</span>
                                            </div>

                                            {/* Calculate total hours and display */}
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-gray-700 font-medium">Total time:</span>
                                                <span className="text-gray-800">
                                                    {Object.values(selectedTimeSlots).reduce((total, slots) =>
                                                        total + slots.length * 0.5, 0
                                                    )} hours
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between font-bold text-blue-800 pt-2 border-t border-blue-200 mt-2">
                                                <span>Total price:</span>
                                                <span>${calculateSubtotal().toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Selected Time Slots By Court */}
                                    <div className="space-y-3">
                                        {Object.entries(selectedTimeSlots).map(([courtId, slots]) => {
                                            const court = courts.find(c => c.id === courtId);
                                            const courtTotal = slots.length * 0.5 * court.pricePerHour;

                                            return (
                                                <div key={courtId} className="border border-gray-200 rounded-lg overflow-hidden">
                                                    <div className="bg-gray-100 px-3 py-2 flex justify-between items-center">
                                                        <span className="font-medium">{court.courtName}</span>
                                                        <span className="text-sm font-medium">${courtTotal.toFixed(2)}</span>
                                                    </div>
                                                    <div className="p-2">
                                                        {slots.map((slot, index) => (
                                                            <div key={index} className="py-1 px-2 text-sm flex items-center border-b last:border-0 border-gray-100">
                                                                <span className="text-gray-500 mr-2">{index + 1}.</span>
                                                                <span className="text-gray-800">{slot.displayTime}</span>
                                                            </div>
                                                        ))}
                                                        <div className="mt-1 pt-1 text-xs text-gray-500 border-t border-gray-100">
                                                            {slots.length * 30} minutes ({slots.length * 0.5} hours)
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Empty State */}
                            {Object.keys(selectedTimeSlots).length === 0 && currentStep === 1 && (
                                <div className="border-t pt-4">
                                    <div className="text-center text-gray-500 py-4">
                                        <FaCalendarAlt className="mx-auto text-2xl mb-2 text-gray-400" />
                                        <p>No time slots selected</p>
                                        <p className="text-sm mt-1">Select courts and time slots to see your booking summary</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default BookCourt;

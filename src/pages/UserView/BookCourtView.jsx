import React, { useState, useEffect } from "react";
import { bookingSchema } from "@/utils/validationSchema";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Radio, Input, Select, DatePicker, Button, Checkbox, Alert, Modal, notification } from "antd";
import { ExclamationCircleOutlined, DollarCircleOutlined, QrcodeOutlined, ClockCircleOutlined, CalendarOutlined } from "@ant-design/icons";
import { isAfter, isBefore, parse, format, addMinutes, isSameMinute } from "date-fns";
import { Book } from "lucide-react";
import Lottie from "lottie-react";
import placeholderImage from "@/assets/image_error.png";
import successAnimation from "@/assets/animations/success_animation.json";
const { Option } = Select;

import courts from "@/data/courtsData";
import bookedSchedule from "@/data/bookedSchedule";

const BookCourtView = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedDuration, setSelectedDuration] = useState(null);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedMethod, setSelectedMethod] = useState(null);

    const [availableSlots, setAvailableSlots] = useState([]);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const { id } = useParams();
    const court = courts.find(c => c.id === id || c.id === parseInt(id));
    const courtSchedules = bookedSchedule.filter((schedule) => schedule.courtId === id || schedule.courtId === parseInt(id));
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        selectedDate: null,
        selectedDuration: null,
        selectedSlot: null,
        selectedMethod: null,
    });

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: null })); // Clear errors when typing
    };

    const calculateAvailableSlots = () => {
        if (!selectedDate || !selectedDuration) {
            setAvailableSlots([]); // Reset slots if no selection
            return;
        }

        console.log("🔄 Calculating available slots...");
        console.log("📅 Selected Date:", format(selectedDate, "yyyy-MM-dd"));
        console.log("⏳ Selected Duration:", selectedDuration);

        const formattedDate = format(selectedDate, "yyyy-MM-dd");
        const today = format(new Date(), "yyyy-MM-dd");
        const currentTime = new Date();

        // Get court's available date range
        const courtStartDate = parse(court.dateRange.start, "yyyy-MM-dd", new Date());
        const courtEndDate = parse(court.dateRange.end, "yyyy-MM-dd", new Date());

        // If selected date is outside the available date range, disable slots
        if (isBefore(parse(formattedDate, "yyyy-MM-dd", new Date()), courtStartDate) ||
            isAfter(parse(formattedDate, "yyyy-MM-dd", new Date()), courtEndDate)) {
            console.log("❌ Selected date is outside the available range.");
            setAvailableSlots([]); // No slots available
            return;
        }

        const courtOpenTime = parse(court.availableHours.start, "HH:mm", new Date());
        const courtCloseTime = parse(court.availableHours.end, "HH:mm", new Date());

        let newAvailableSlots = [];
        let currentSlot = courtOpenTime;

        while (isBefore(currentSlot, courtCloseTime)) {
            const slotStart = format(currentSlot, "HH:mm");
            const slotEnd = format(addMinutes(currentSlot, selectedDuration), "HH:mm");
            const slotEndTime = addMinutes(currentSlot, selectedDuration);

            // Ensure the slot end time is within or exactly at closing time
            if (isAfter(slotEndTime, courtCloseTime) && !isSameMinute(slotEndTime, courtCloseTime)) {
                break; // Stop if the slot end time goes beyond closing
            }

            // Ensure it does not overlap with booked schedules
            const isOverlapping = courtSchedules.some(
                (schedule) =>
                    schedule.date === formattedDate &&
                    isBefore(parse(schedule.timeStart, "HH:mm", new Date()), parse(slotEnd, "HH:mm", new Date())) &&
                    isAfter(parse(schedule.timeEnd, "HH:mm", new Date()), parse(slotStart, "HH:mm", new Date()))
            );

            // If today, ensure slot is not in the past
            const isPast = formattedDate === today && isBefore(parse(slotStart, "HH:mm", new Date()), currentTime);

            if (!isOverlapping && !isPast) {
                newAvailableSlots.push({ start: slotStart, end: slotEnd });
            }

            currentSlot = addMinutes(currentSlot, 30); // Move by 30-minute intervals
        }

        console.log("✅ Available Slots:", newAvailableSlots);
        setAvailableSlots(newAvailableSlots);
    };

    const isFormValid = fullName && email && phone && selectedDate && selectedDuration && selectedSlot && selectedMethod;

    const showWarning = () => {
        notification.warning({
            message: "Incomplete Form",
            description: "Please fill in all required fields before completing your booking.",
            placement: "top",
        });
    };

    const handleCompleteOrder = async () => {
        console.log("📌 Form Data:", formData); // Debugging: Check if all fields are populated

        try {
            await bookingSchema.validate(formData, { abortEarly: false });
            setErrors({}); // Clear previous errors
            setIsSuccessModalOpen(true);
        } catch (err) {
            if (err.inner) {
                const formattedErrors = {};
                err.inner.forEach((e) => {
                    formattedErrors[e.path] = e.message;
                });
                setErrors(formattedErrors);
            } else {
                console.error("Validation Error:", err);
            }
            notification.warning({ message: "Form Error", description: "Please fill in all required fields correctly." });
        }
    };



    // Function to close the modal
    const handleClose = () => {
        // setIsSuccessModalOpen(false);
        navigate("/")
    };


    // Refresh available slots when date or duration changes
    useEffect(() => {
        calculateAvailableSlots();
    }, [selectedDate, selectedDuration]);

    useEffect(() => {
        console.log("📅 Date Changed:", selectedDate ? format(selectedDate, "yyyy-MM-dd") : "None");
    }, [selectedDate]);

    useEffect(() => {
        console.log("⏳ Duration Changed:", selectedDuration || "None");
    }, [selectedDuration]);

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="max-w-6xl mx-auto p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* SECTION 1: ORDER REVIEW */}
                    <div className="bg-white p-6 shadow-lg flex flex-col gap-4">
                        <h2 className="text-lg font-semibold">1. Schedule Your Court</h2>

                        {/* COURT IMAGE & DETAILS */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <img
                                src={court.image || placeholderImage}
                                alt={court.name}
                                className="w-full sm:w-32 sm:h-32 object-cover rounded-lg"
                                onError={(e) => (e.target.src = placeholderImage)}
                            />
                            <div>
                                <h3 className="text-xl font-semibold">{court.name}</h3>
                                <p className="text-gray-500">{court.city}</p>
                                <p className="text-gray-500">{court.address}</p>
                            </div>
                        </div>

                        {/* DATE SELECTION */}
                        <div>
                            <div className="font-medium mb-2">Select Date</div>
                            <DatePicker
                                className="w-full"
                                placeholder="Choose Date"
                                onChange={(date) => { setSelectedDate(date); handleInputChange("selectedDate", date); }}
                                disabledDate={(current) => {
                                    if (!court || !court.dateRange) return true; // Prevent errors if `court` is undefined

                                    const today = new Date(); // Get current date
                                    today.setHours(0, 0, 0, 0); // Normalize to start of the day

                                    const startDate = parse(court.dateRange.start, "yyyy-MM-dd", new Date());
                                    const endDate = parse(court.dateRange.end, "yyyy-MM-dd", new Date());

                                    return (
                                        isBefore(current, today) ||  // Disable past dates
                                        isBefore(current, startDate) || // Disable dates before court's available range
                                        isAfter(current, endDate)  // Disable dates after court's available range
                                    );
                                }}
                            /> {errors.selectedDate && <span className="text-red-500">{errors.selectedDate}</span>}
                        </div>

                        {/* DURATION SELECTION */}
                        <div>
                            <div className="font-medium mb-2">Select Duration</div>
                            <Select className="w-full" placeholder="Select Duration" onChange={(value) => { setSelectedDuration(Number(value)); handleInputChange("selectedDuration", value); }}>
                                {court.durations.map((duration) => (
                                    <Option key={duration} value={duration}>
                                        {duration} Minutes
                                    </Option>
                                ))}
                            </Select>
                            {errors.selectedDuration && <span className="text-red-500">{errors.selectedDuration}</span>}
                        </div>

                        {/* AVAILABLE SLOTS */}
                        <div>
                            <h3 className="font-semibold mb-2">Available Slots</h3>
                            {!selectedDate || !selectedDuration ? (
                                <Alert message="Please select the date and duration!" type="warning" showIcon />
                            ) : availableSlots.length === 0 ? (
                                <Alert message="No available time slot!" type="error" showIcon />
                            ) : (
                                <Select
                                    className="w-full"
                                    placeholder="Select an available time"
                                    onChange={(value) => {
                                        console.log("🛠 Selected Slot:", value);  // Debugging
                                        setSelectedSlot(value);
                                        handleInputChange("selectedSlot", value);
                                    }}
                                >
                                    {availableSlots.map((slot, index) => (
                                        <Option key={index} value={JSON.stringify(slot)}>
                                            {slot.start} - {slot.end}
                                        </Option>
                                    ))}
                                </Select>
                            )}
                        </div>
                    </div>

                    {/* SECTION 2: CUSTOMER INFORMATION & PAYMENT */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 shadow-lg">
                            <h2 className="text-lg font-semibold mb-4">2. Customer Information</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">Full Name</label>
                                    <Input placeholder="Enter your full name" onChange={(e) => { setFullName(e.target.value); handleInputChange("fullName", e.target.value) }} />
                                    {errors.fullName && <span className="text-red-500">{errors.fullName}</span>}
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">Email Address</label>
                                    <Input placeholder="Enter your email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); handleInputChange("email", e.target.value) }} />
                                    {errors.email && <span className="text-red-500">{errors.email}</span>}
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium mb-1">Mobile Number</label>
                                    <Input placeholder="Enter your phone number" type="tel" value={phone} onChange={(e) => { setPhone(e.target.value); handleInputChange("phone", e.target.value) }} />
                                    {errors.phone && <span className="text-red-500">{errors.phone}</span>}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 shadow-lg">
                            <h2 className="text-lg font-semibold mb-4">3. Select Payment Method</h2>
                            <Radio.Group value={selectedMethod} onChange={(e) => setSelectedMethod(e.target.value)} className="w-full">
                                <div className="flex flex-col gap-3">
                                    <div
                                        className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all duration-200 ${selectedMethod === "cash" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
                                            }`}
                                        onClick={() => { setSelectedMethod("cash"); handleInputChange("selectedMethod", "cash"); }}
                                    >
                                        <DollarCircleOutlined className="text-2xl" />
                                        <span className="text-lg">Cash Payment</span>
                                    </div>

                                    <div
                                        className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all duration-200 ${selectedMethod === "qr" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
                                            }`}
                                        onClick={() => { setSelectedMethod("qr"); handleInputChange("selectedMethod", "qr"); }}
                                    >
                                        <QrcodeOutlined className="text-2xl" />
                                        <span className="text-lg">QR Code / Credit Card</span>
                                    </div>
                                </div>
                            </Radio.Group>
                            {errors.selectedMethod && <span className="text-red-500">{errors.selectedMethod}</span>}
                        </div>
                    </div>

                    {/* SECTION 3: ORDER SUMMARY */}
                    <div className="sm:col-span-2 lg:col-span-1">
                        <div className="bg-white shadow-lg">
                            <div className="p-6 pb-3">
                                <div className="text-xl font-semibold mb-4">ORDER SUMMARY</div>

                                <p className="text-lg font-medium">{court.name}</p>
                                <p className="text-gray-500">{court.address}</p>

                                <div className="my-2">
                                    <p className="pb-1"><CalendarOutlined className="text-lg text-blue-600" /> Date: <span className="font-medium">{selectedDate ? format(selectedDate, "PPPP") : "Not selected"}</span></p>
                                    <p><ClockCircleOutlined className="text-lg text-orange-600" /> Duration: <span className="font-medium">{selectedDuration ? `${selectedDuration} minutes` : "Not selected"}</span></p>
                                </div>

                                <p>Subtotal: <span className="font-medium">${selectedDuration ? (court.pricePerHour * (selectedDuration / 60)).toFixed(2) : "0.00"}</span></p>
                                <p>Discount: <span className="font-medium">$0.00</span></p>
                            </div>
                            <p className="font-semibold text-xl py-4 px-6 bg-gray-200">
                                ORDER TOTAL: <span className="text-gray-800">${selectedDuration ? (court.pricePerHour * (selectedDuration / 60)).toFixed(2) : "0.00"}</span>
                            </p>
                        </div>

                        {/* SUBMIT BUTTON */}
                        <div className="mt-4">
                            <Checkbox>Email me about new products, deals, and surprise treats!</Checkbox>
                            <Button
                                type="primary"
                                className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-lg py-2"
                                onClick={isFormValid ? handleCompleteOrder : showWarning}
                                disabled={!isFormValid}
                            >
                                COMPLETE ORDER
                            </Button>
                        </div>
                        {/* SUCCESS MODAL WITH LOTTIE ANIMATION */}
                        <Modal
                            title="Booking Confirmed!"
                            open={isSuccessModalOpen}
                            onCancel={handleClose}
                            footer={
                                <div className="flex justify-between mt-8">
                                    <Button key="history" type="default" onClick={() => navigate("/booking-history")}>
                                        View Booking History
                                    </Button>
                                    <Button key="home" type="primary" onClick={() => navigate("/")}>
                                        Go Back to Homepage
                                    </Button>
                                </div>
                            }
                            centered
                        >
                            <div className="flex flex-col items-center justify-center">
                                <Lottie animationData={successAnimation} className="w-64 h-64" />
                                <p className="text-lg font-semibold mt-4">Your booking is registered!</p>
                            </div>
                        </Modal>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default BookCourtView;

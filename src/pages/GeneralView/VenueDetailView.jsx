import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, Spin, Tag, Button, Carousel, Table, Pagination } from "antd";
import {
    FaMapMarkerAlt,
    FaClock,
    FaStar,
    FaEnvelope,
    FaPhone,
    FaUser,
    FaInfoCircle,
    FaList,
    FaAddressCard,
    FaMapMarked,
    FaDollarSign,
    FaBasketballBall,
} from "react-icons/fa";
import venuesData from "@/data/venue_mock_data";
import courtsData from "@/data/court_mock_data"; // Mock courts data

const VenueDetailView = () => {
    const { venueId } = useParams();
    const [venue, setVenue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("details");
    const [pagination, setPagination] = useState({ current: 0, pageSize: 3 });

    useEffect(() => {
        // Simulate API fetching with mock data
        setTimeout(() => {
            const foundVenue = venuesData.find((v) => v.id === venueId);
            setVenue(foundVenue || null);
            setLoading(false);
        }, 500);

        // Scroll to top on component mount
        window.scrollTo(0, 0);
    }, [venueId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin size="large" />
            </div>
        );
    }

    if (!venue) {
        return (
            <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[50vh]">
                <div className="text-red-500 text-7xl mb-4">
                    <FaInfoCircle />
                </div>
                <h2 className="text-2xl font-bold mb-2">Venue Not Found</h2>
                <p className="text-gray-600 mb-6">
                    The venue you're looking for doesn't exist or has been removed.
                </p>
                <Button type="primary" href="/">
                    Return to Home
                </Button>
            </div>
        );
    }

    const googleMapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(
        venue.address.full
    )}`;

    const columns = [
        {
            title: "Day",
            dataIndex: "day",
            key: "day",
            align: "left",
        },
        {
            title: "Open",
            dataIndex: "open",
            key: "open",
            align: "center",
        },
        {
            title: "Close",
            dataIndex: "close",
            key: "close",
            align: "center",
        },
    ];

    const data = Object.entries(venue.operating_hours).map(([day, hours]) => ({
        key: day,
        day: day.charAt(0).toUpperCase() + day.slice(1),
        open: hours.open,
        close: hours.close,
    }));

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 py-6">
                {/* Top Section with Venue Name, Address, and Basic Info */}
                <div className="mb-6">
                    {/* Venue Name */}
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
                        {venue.name}
                    </h1>

                    {/* Sports Available */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {venue.sports_available.map((sport, index) => (
                            <Tag key={index} color="blue">
                                {sport}
                            </Tag>
                        ))}
                    </div>

                    {/* Image Carousel */}
                    <div className="overflow-hidden rounded-xl shadow-md">
                        <Carousel autoplay>
                            {venue.images.map((image, index) => (
                                <div key={index}>
                                    <img
                                        src={image}
                                        alt={`Venue Image ${index + 1}`}
                                        className="w-full h-64 object-cover rounded-xl"
                                    />
                                </div>
                            ))}
                        </Carousel>
                    </div>
                </div>

                {/* Main Layout Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Left Column - Tabs */}
                    <div className="lg:col-span-2 flex flex-col">
                        {/* Tab Navigation */}
                        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                            <div className="flex justify-between overflow-x-auto no-scrollbar">
                                <button
                                    onClick={() => setActiveTab("details")}
                                    className={`flex items-center justify-center px-4 py-2 rounded-lg transition-all ${activeTab === "details"
                                        ? "bg-blue-600 text-white font-medium"
                                        : "text-gray-600 hover:bg-gray-100"
                                        }`}
                                >
                                    <FaInfoCircle className="mr-2" />
                                    <span>Details</span>
                                </button>

                                <button
                                    onClick={() => setActiveTab("facilities")}
                                    className={`flex items-center justify-center px-4 py-2 rounded-lg transition-all ${activeTab === "facilities"
                                        ? "bg-blue-600 text-white font-medium"
                                        : "text-gray-600 hover:bg-gray-100"
                                        }`}
                                >
                                    <FaList className="mr-2" />
                                    <span>Facilities</span>
                                </button>

                                <button
                                    onClick={() => setActiveTab("contact")}
                                    className={`flex items-center justify-center px-4 py-2 rounded-lg transition-all ${activeTab === "contact"
                                        ? "bg-blue-600 text-white font-medium"
                                        : "text-gray-600 hover:bg-gray-100"
                                        }`}
                                >
                                    <FaAddressCard className="mr-2" />
                                    <span>Contact</span>
                                </button>

                                <button
                                    onClick={() => setActiveTab("location")}
                                    className={`flex items-center justify-center px-4 py-2 rounded-lg transition-all ${activeTab === "location"
                                        ? "bg-blue-600 text-white font-medium"
                                        : "text-gray-600 hover:bg-gray-100"
                                        }`}
                                >
                                    <FaMapMarked className="mr-2" />
                                    <span>Location</span>
                                </button>

                                <button
                                    onClick={() => setActiveTab("pricing")}
                                    className={`flex items-center justify-center px-4 py-2 rounded-lg transition-all ${activeTab === "pricing"
                                        ? "bg-blue-600 text-white font-medium"
                                        : "text-gray-600 hover:bg-gray-100"
                                        }`}
                                >
                                    <FaDollarSign className="mr-2" />
                                    <span>Pricing</span>
                                </button>

                                <button
                                    onClick={() => setActiveTab("courts")}
                                    className={`flex items-center justify-center px-4 py-2 rounded-lg transition-all ${activeTab === "courts"
                                        ? "bg-blue-600 text-white font-medium"
                                        : "text-gray-600 hover:bg-gray-100"
                                        }`}
                                >
                                    <FaBasketballBall className="mr-2" />
                                    <span>Courts</span>
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
                                    <h2 className="text-xl font-bold mb-4">About this Venue</h2>
                                    <p className="text-gray-700 leading-relaxed mb-4">
                                        {venue.description || "No description available."}
                                    </p>

                                    <h3 className="text-lg font-semibold mt-6 mb-3">
                                        Operating Hours
                                    </h3>
                                    <Table
                                        columns={columns}
                                        dataSource={data}
                                        pagination={false}
                                        bordered
                                        className="mb-6"
                                    />;
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
                                    <div className="flex flex-wrap gap-2">
                                        {venue.amenities.map((amenity, index) => (
                                            <Tag key={index} color="green">
                                                {amenity}
                                            </Tag>
                                        ))}
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
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                            <FaUser className="text-xl" />
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-sm">Venue Owner</p>
                                            <h4 className="text-lg font-medium text-gray-800">
                                                {venue.contact_info.owner}
                                            </h4>
                                        </div>
                                    </div>

                                    {/* Email */}
                                    {venue.contact_info.email && (
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
                                                <FaEnvelope />
                                            </div>
                                            <div>
                                                <p className="text-gray-500 text-sm">Email</p>
                                                <a
                                                    href={`mailto:${venue.contact_info.email}`}
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    {venue.contact_info.email}
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    {/* Phone */}
                                    {venue.contact_info.phone && (
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white">
                                                <FaPhone />
                                            </div>
                                            <div>
                                                <p className="text-gray-500 text-sm">Phone</p>
                                                <p className="text-gray-800 font-medium">{venue.contact_info.phone}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Website */}
                                    {venue.contact_info.website && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white">
                                                <FaMapMarked />
                                            </div>
                                            <div>
                                                <p className="text-gray-500 text-sm">Website</p>
                                                <a
                                                    href={venue.contact_info.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    {venue.contact_info.website}
                                                </a>
                                            </div>
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
                                    <iframe
                                        title="Venue Location"
                                        width="100%"
                                        height="400"
                                        className="rounded-lg"
                                        src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${venue.address.latitude},${venue.address.longitude}`}
                                        allowFullScreen
                                    ></iframe>
                                </motion.div>
                            )}

                            {/* Pricing Tab */}
                            {activeTab === "pricing" && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.4 }}
                                    className="bg-white rounded-xl shadow-sm p-6"
                                >
                                    <h2 className="text-xl font-bold mb-4">Pricing Details</h2>

                                    {/* Pricing Table */}
                                    <Table
                                        columns={[
                                            {
                                                title: "Sport",
                                                dataIndex: "sport",
                                                key: "sport",
                                                align: "left",
                                            },
                                            {
                                                title: "Hourly Rate",
                                                dataIndex: "rate",
                                                key: "rate",
                                                align: "center",
                                                render: (rate) => `$${rate}/hour`,
                                            },
                                        ]}
                                        dataSource={Object.entries(venue.pricing_model.hourly_rate).map(
                                            ([sport, rate]) => ({
                                                key: sport,
                                                sport: sport.charAt(0).toUpperCase() + sport.slice(1),
                                                rate,
                                            })
                                        )}
                                        pagination={false}
                                        bordered
                                        className="mb-4"
                                    />

                                    {/* Membership Discount */}
                                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                                        <p className="text-gray-700 text-lg">
                                            <strong>Membership Discount:</strong>{" "}
                                            {venue.pricing_model.membership_discount}%
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                            {/* Courts Tab */}
                            {activeTab === "courts" && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.4 }}
                                    className="bg-white rounded-xl shadow-sm p-6"
                                >
                                    <h2 className="text-xl font-bold mb-4">Available Courts</h2>

                                    {/* Courts List with Pagination */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {courtsData
                                            .filter((court) => venue.courts.includes(court.court_id))
                                            .slice(pagination.current * pagination.pageSize, (pagination.current + 1) * pagination.pageSize)
                                            .map((court) => (
                                                <Card key={court.court_id} className="shadow-md">
                                                    <img
                                                        src={court.images[0]}
                                                        alt={court.name}
                                                        className="w-full h-32 object-cover rounded-md"
                                                    />
                                                    <h3 className="font-bold mt-2">{court.name}</h3>
                                                    <p>Sport: {court.sport_type}</p>
                                                    <p>Surface: {court.features.surface_type}</p>
                                                </Card>
                                            ))}
                                    </div>

                                    {/* Pagination */}
                                    <div className="mt-6 flex justify-center">
                                        <Pagination
                                            current={pagination.current + 1}
                                            pageSize={pagination.pageSize}
                                            total={courtsData.filter((court) => venue.courts.includes(court.court_id)).length}
                                            onChange={(page) => setPagination({ ...pagination, current: page - 1 })}
                                            showSizeChanger
                                            pageSizeOptions={["6", "9", "12"]}
                                            onShowSizeChange={(current, size) => setPagination({ current: 0, pageSize: size })}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Ratings & Reviews */}
                    <div>
                        <Card className="shadow-sm">
                            <h3 className="text-xl font-bold mb-4">Ratings & Reviews</h3>
                            <div className="flex items-center mb-4">
                                <span className="text-3xl font-bold">{venue.rating}</span>
                                <div className="ml-2 text-yellow-500">
                                    {"★".repeat(Math.floor(venue.rating))}
                                    {"☆".repeat(5 - Math.floor(venue.rating))}
                                </div>
                            </div>

                            {/* Write Review Button */}
                            <div className="mb-4">
                                <Button
                                    type="primary"
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                    onClick={() => {
                                        // Add functionality to open a modal or navigate to a review form
                                        console.log("Write Review button clicked");
                                    }}
                                >
                                    Write a Review
                                </Button>
                            </div>

                            {/* Reviews List */}
                            {venue.reviews.map((review, index) => (
                                <div key={index} className="mb-4 p-2 bg-gray-100 rounded-md">
                                    <strong>{review.user_id}</strong> - {review.rating} ★
                                    <p>{review.comment}</p>
                                </div>
                            ))}
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VenueDetailView;
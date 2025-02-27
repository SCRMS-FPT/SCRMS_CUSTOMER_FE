import React, { useState } from "react";
import { Upload, Modal, Image, Button, TimePicker, Input, Select } from "antd";
import { PlusOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import sportsData from "../data/sportsData";
import dayjs from "dayjs";

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const ManageCourts = ({ court, onSave, onCancel }) => {
    const [editedCourt, setEditedCourt] = useState({
        id: court?.id || "",
        name: court?.name || "",
        city: court?.city || "",
        address: court?.address || "",
        availableHours: court?.availableHours || { start: "08:00", end: "22:00" },
        description: court?.description || "",
        durations: court?.durations || [],
        price: court?.price || 0,
        sport: court?.sport || [],
        image: court?.image || "",
        image_details: court?.image_details || [],
        status: court?.status || "available",
    });

    const [expandedSports, setExpandedSports] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [previewOpen, setPreviewOpen] = useState(false);

    /** Sports Selection Logic */
    const handleSportChange = (sport) => {
        if (sport === "All Sports") {
            setEditedCourt((prev) => ({
                ...prev,
                sport: prev.sport.includes("All Sports") ? [] : ["All Sports"],
            }));
        } else {
            setEditedCourt((prev) => ({
                ...prev,
                sport: prev.sport.includes(sport)
                    ? prev.sport.filter((s) => s !== sport)
                    : [...prev.sport.filter((s) => s !== "All Sports"), sport],
            }));
        }
    };

    /** Handle Main Image Upload */
    const handleMainImageChange = ({ fileList }) => {
        if (fileList.length > 0) {
            getBase64(fileList[0].originFileObj).then((imageUrl) => {
                setEditedCourt((prev) => ({ ...prev, image: imageUrl }));
            });
        } else {
            setEditedCourt((prev) => ({ ...prev, image: "" }));
        }
    };

    /** Handle Additional Image Upload */
    const handleAdditionalImageChange = ({ fileList }) => {
        setEditedCourt((prev) => ({
            ...prev,
            image_details: fileList.map((file) =>
                file.url ? file.url : URL.createObjectURL(file.originFileObj)
            ),
        }));
    };

    /** Handle Image Preview */
    const handlePreview = async () => {
        setPreviewImage(editedCourt.image);
        setPreviewOpen(true);
    };
    /** Handle Delete */
    const handleDelete = () => {
        setEditedCourt((prev) => ({ ...prev, image: "" })); // Reset the image
    };


    return (
        <div className="mt-10">
            
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-lg border border-gray-200">
        <h1 className="text-center text-2xl font-semibold mb-6">Update Court Information</h1>
            {/* Image Upload & Court Info */}
            <div className="flex gap-6">
                {/* Image Upload - Full Height */}
                <div
                    className={`w-1/6 aspect-square relative flex items-center justify-center transition-all duration-300 ${editedCourt.image
                        ? ""
                        : "border-2 border-dashed border-gray-300 hover:border-blue-500"
                        }`}
                >
                    {/* Uploaded Image */}
                    {editedCourt.image && (
                        <div className="relative w-full h-full">
                            <img
                                src={editedCourt.image}
                                alt="Uploaded"
                                className="w-full h-full object-cover cursor-pointer"
                                onClick={handlePreview}
                            />
                            {/* Delete Button */}
                            <button
                                onClick={handleDelete}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                            >
                                <DeleteOutlined />
                            </button>
                        </div>
                    )}

                    {/* Upload Button (Only When No Image) */}
                    {!editedCourt.image && (
                        <Upload
                            showUploadList={false}
                            accept="image/*"
                            beforeUpload={() => false}
                            onChange={handleMainImageChange}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <div className="text-center cursor-pointer">
                                <PlusOutlined />
                                <div className="mt-2">Upload</div>
                            </div>
                        </Upload>
                    )}
                </div>


                {/* Court Info */}
                <div className="flex-1 space-y-3">
                    <div className="mb-3">
                        <Input
                            name="name"
                            value={editedCourt.name}
                            onChange={(e) => setEditedCourt({ ...editedCourt, name: e.target.value })}
                            placeholder="Court Name"
                            size="large"
                        />
                    </div>

                    <div className="mb-3">
                        <Input
                            name="city"
                            value={editedCourt.city}
                            onChange={(e) => setEditedCourt({ ...editedCourt, city: e.target.value })}
                            placeholder="City"
                            size="large"
                        />
                    </div>

                    <div className="">
                        <Input
                            name="address"
                            value={editedCourt.address}
                            onChange={(e) => setEditedCourt({ ...editedCourt, address: e.target.value })}
                            placeholder="Address"
                            size="large"
                        />
                    </div>
                </div>
            </div>

            {/* Description */}
            <div className="mt-4">
                <Input.TextArea
                    name="description"
                    value={editedCourt.description}
                    onChange={(e) => setEditedCourt({ ...editedCourt, description: e.target.value })}
                    placeholder="Court Description"
                    rows={4}
                    size="large"
                />
            </div>

            {/* Time, Duration & Price */}
            <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="flex items-center gap-2">
                    <h2 className="text-gray-700 font-medium">Time Start</h2><TimePicker
                        format="HH:mm"
                        value={dayjs(editedCourt.availableHours.start, "HH:mm")}
                        onChange={(time) =>
                            setEditedCourt({
                                ...editedCourt,
                                availableHours: { ...editedCourt.availableHours, start: time.format("HH:mm") },
                            })
                        }
                    /></div>

                <div className="flex items-center gap-2">
                    <h2 className="text-gray-700 font-medium">Time End</h2>
                    <TimePicker
                        format="HH:mm"
                        value={dayjs(editedCourt.availableHours.end, "HH:mm")}
                        onChange={(time) =>
                            setEditedCourt({
                                ...editedCourt,
                                availableHours: { ...editedCourt.availableHours, end: time.format("HH:mm") },
                            })
                        }
                    /></div>

                <div className="flex items-center gap-2">
                    <h2 className="text-gray-700 font-medium">Price</h2>
                    <Input
                        type="number"
                        name="price"
                        value={editedCourt.price}
                        onChange={(e) => setEditedCourt({ ...editedCourt, price: e.target.value })}
                        placeholder="Price ($)"
                        className="w-32"
                    />
                </div>

            </div>

            {/* Duration Selection */}
            <div className="mt-4 flex gap-3">
                {[60, 90, 120].map((dur) => (
                    <button
                        key={dur}
                        onClick={() =>
                            setEditedCourt((prev) => ({
                                ...prev,
                                durations: prev.durations.includes(dur)
                                    ? prev.durations.filter((d) => d !== dur)
                                    : [...prev.durations, dur],
                            }))
                        }
                        className={`px-3 py-1 border rounded-md transition duration-200 ${editedCourt.durations.includes(dur)
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 hover:bg-gray-300"
                            }`}
                    >
                        {dur} min
                    </button>
                ))}
            </div>


            {/* Sports Selection */}
            <div className="mt-4">
                <label className="block text-sm font-semibold">Sports Offered</label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                    {(expandedSports ? sportsData : sportsData.slice(0, 3)).map(
                        ({ name, icon }) => (
                            <button
                                key={name}
                                className={`flex items-center gap-2 p-2 border rounded-md ${editedCourt.sport.includes(name)
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200"
                                    }`}
                                onClick={() => handleSportChange(name)}
                            >
                                <img src={icon} alt={name} className="w-6 h-6" />
                                {name}
                            </button>
                        )
                    )}
                    <button
                        onClick={() => setExpandedSports(!expandedSports)}
                        className="p-2 border rounded-md bg-gray-200"
                    >
                        {expandedSports ? "Show Less" : "Show More"}
                    </button>
                </div>
            </div>

            {/* Image Details Upload (Multiple Images) */}
            <div className="mt-4">
                <label className="block text-sm font-semibold">Court Images</label>
                <Upload
                    listType="picture-card"
                    multiple
                    accept="image/*"
                    beforeUpload={() => false}
                    onChange={handleAdditionalImageChange}
                    onPreview={handlePreview}
                >
                    {editedCourt.image_details.length >= 8 ? null : (
                        <div>
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Upload</div>
                        </div>
                    )}
                </Upload>
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-6">
                <button
                    onClick={onCancel}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                    Cancel
                </button>
                <button
                    onClick={() => onSave(editedCourt)}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                    Save Changes
                </button>
            </div>

            {/* Preview Modal */}
            <Image
                wrapperStyle={{ display: "none" }}
                preview={{
                    visible: previewOpen,
                    onVisibleChange: (visible) => setPreviewOpen(visible),
                    afterOpenChange: (visible) => !visible && setPreviewImage(""),
                }}
                src={previewImage}
            />
        </div>
        </div>
    );
};

export default ManageCourts;

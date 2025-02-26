import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FaImage } from "react-icons/fa";
import placeholderImage from "../assets/image_error.png";

const CoachImageCarousel = ({ images, name }) => {
    const hasImages = images && images.length > 0;

    return (
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
                    {images.map((img, index) => (
                        <SwiperSlide key={index} className="flex justify-center items-center h-full">
                            <img
                                src={img}
                                alt={name}
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
    );
};

export default CoachImageCarousel;
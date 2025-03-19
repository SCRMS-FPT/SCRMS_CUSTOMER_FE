import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import img1 from "@/assets/football.png";
import img2 from "@/assets/tennis.jpg";
import img3 from "@/assets/adventure_sport.jpg";
import img4 from "@/assets/esport.jpg";
import img5 from "@/assets/swimming.jpg";
import img6 from "@/assets/personal_trainers.jpg";

const sportsData = [
    { img: img1, name: "Football" },
    { img: img2, name: "Tennis" },
    { img: img3, name: "Adventure Sports" },
    { img: img4, name: "eSports" },
    { img: img5, name: "Swimming" },
    { img: img6, name: "Personal Trainers" },
];

const SportsCarousel = () => {
    return (
        <div className="max-w-6xl mx-auto py-10 px-4">
            <h2 className="text-center text-4xl font-bold text-gray-900 mb-8">
                Popular Sports
            </h2>

            {/* Swiper Carousel */}
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={20}
                slidesPerView={4} // Default: 4 items
                navigation={{ clickable: true, }}
                pagination={{ clickable: true,el: '.custom-pagination' }}
                loop={true} // Infinite Loop
                autoplay={{ delay: 3000, disableOnInteraction: false }} // Auto-scroll
                breakpoints={{
                    1024: { slidesPerView: 4 }, // Large Screens: 4 items
                    768: { slidesPerView: 2 },  // Medium Screens: 2 items
                    640: { slidesPerView: 1 },  // Small Screens: 1 item
                }}
                className="relative"
            >
                {sportsData.map((sport, index) => (
                    <SwiperSlide key={index} className="relative group">
                        <div className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer">
                            <img
                                src={sport.img}
                                alt={sport.name}
                                className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
                            />
                            
                            {/* Hover Effect for Text */}
                            <div className="absolute bottom-0 left-0 right-0 h-16 flex items-center justify-center  group-hover:bg-white/70 transition-all duration-300">
                                <h3 className="text-3xl font-bold text-white group-hover:text-black transition-colors duration-300">
                                    {sport.name}
                                </h3>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            <div className="custom-pagination mt-5 flex justify-center space-x-2"></div>


        </div>
    );
};

export default SportsCarousel;

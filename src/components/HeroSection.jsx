import React, { useState, useEffect } from "react";

// Import images from src/assets
import img1 from "../assets/badminton_01.png";
import img2 from "../assets/gym_01.jpg";
import img3 from "../assets/soccer_01.jpg";
import img4 from "../assets/swimming_01.jpg";
import img5 from "../assets/soccer_02.jpg";
import img6 from "../assets/tennis_01.jpg";
import FilterForm from "./FilterForm";

const HeroSection = () => {
  const images = [img1, img2, img3, img4, img5, img6];
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden">
      {/* Background Image Slideshow */}
      <div className="absolute inset-0 transition-opacity duration-1000">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`slide-${index}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentImage ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      {/* Light Overlay (Darker Effect Without Blocking View) */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-black px-6">
        <h2 className="text-6xl font-bold text-white">FIND YOUR SPORT</h2>
        <p className="text-2xl font-semibold mt-2 mb-6 text-white">SEARCH. BOOK. PLAY. REPEAT.</p>

        {/* Search Form */}
        {/* <form
          className="mt-6 bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              name="search_keywords"
              placeholder="What are you looking for?"
              className="p-2 border border-gray-300 rounded"
            />
            <select name="search_categories" className="p-2 border border-gray-300 rounded">
              <option value="">All Categories</option>
              <option value="badminton">Badminton</option>
              <option value="gym">Gym</option>
              <option value="soccer">Soccer</option>
              <option value="swimming">Swimming</option>
              <option value="tennis">Tennis</option>
            </select>
            <input
              type="text"
              name="_search_location"
              placeholder="Location"
              className="p-2 border border-gray-300 rounded"
            />
          </div>
          <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-800 w-full">
            Search
          </button>
        </form> */}

        {/* Filter Form */}
        {/* <form
          action="https://sportsbooking.mt/filter"
          method="GET"
          className="mt-6 bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <select name="filter-field-sport" className="p-2 border border-gray-300 rounded">
              <option value="basketball">Basketball</option>
              <option value="football">Football</option>
              <option value="gym">Gym</option>
              <option value="hockey">Hockey</option>
              <option value="tennis">Tennis</option>
              <option value="volleyball">Volleyball</option>
            </select>
            <input type="date" name="filter-field-date" className="p-2 border border-gray-300 rounded" />
            <select name="filter-field-time" className="p-2 border border-gray-300 rounded">
              <option value="12:00">12:00</option>
              <option value="1:00">1:00</option>
              <option value="2:00">2:00</option>
              <option value="3:00">3:00</option>
              <option value="4:00">4:00</option>
            </select>
            <select name="filter-field-meridian" className="p-2 border border-gray-300 rounded">
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
          <button className="mt-4 bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-700 w-full">
            Filter
          </button>
        </form> */}
        <FilterForm />
      </div>
    </section>
  );
};

export default HeroSection;

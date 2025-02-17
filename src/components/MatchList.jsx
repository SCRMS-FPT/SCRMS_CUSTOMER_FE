import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaUser, FaCalendar, FaMapMarkerAlt } from "react-icons/fa";

import { getDistance } from "geolib";

const sampleMatches = [
  {
    id: 1,
    location: "Hà Nội - Sân Cầu Giấy",
    date: "2025-02-20",
    skillLevel: "Intermediate",
    players: ["Nguyễn Văn A", "Trần Thị B", "Lê Văn C", "NGON"],
  },
  {
    id: 2,
    location: "Hồ Chí Minh - Sân Quận 1",
    date: "2025-02-22",
    skillLevel: "Advanced",
    players: ["Phạm Văn D", "Đỗ Thị E"],
  },
  {
    id: 3,
    location: "Đà Nẵng - Sân Mỹ An",
    date: "2025-02-25",
    skillLevel: "Beginner",
    players: ["Bùi Văn F", "Ngô Thị G", "Tạ Văn H"],
  },
];

const MatchList = ({ searchParams }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  // const [isInside5km, setIsInside5km] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Trình duyệt của bạn không hỗ trợ Geolocation.");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        setLocation(userLocation);

        // const distance = getDistance(userLocation, targetLocation);

        console.log(
          `Tọa độ hiện tại: ${userLocation.latitude} / ${userLocation.longitude}`
        );

        // setIsInside5km(distance <= 5000);
      },
      (err) => {
        // setError("Không thể lấy vị trí: " + err.message);
      }
    );

    setTimeout(() => {
      setMatches(sampleMatches);
      setLoading(false);
    }, 1000);
  }, [searchParams]);

  if (loading) {
    return <div className="text-center">Loading matches...</div>;
  }

  if (matches.length === 0) {
    return (
      <div className="text-center">
        No matches found. Try adjusting your search criteria.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {matches.map((match) => (
        <motion.div
          key={match.id}
          className="bg-white rounded-lg shadow-md overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-4 h-full flex flex-col justify-between">
            <h3 className="text-xl font-semibold mb-2">{match.location}</h3>
            <div className="flex items-center text-gray-600 mb-2">
              <FaCalendar className="mr-2" />
              <span>{new Date(match.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center text-gray-600 mb-2">
              <FaMapMarkerAlt className="mr-2" />
              <span>{match.location}</span>
            </div>
            <div className="flex items-center text-gray-600 mb-4">
              <FaUser className="mr-2" />
              <span>{match.skillLevel}</span>
            </div>
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Players:</h4>
              <ul className="list-disc list-inside">
                {match.players.slice(0, 3).map((player, index) => (
                  <li key={index}>{player}</li>
                ))}
                {match.players.length > 3 && <li>...</li>}
              </ul>
            </div>
            <div className="bg-gray-100 p-4">
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                Join Match
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default MatchList;

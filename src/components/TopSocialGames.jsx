import React, { useState } from "react";
import { Card, CardContent } from "@mui/material";
import socialGames from "../data/socialGames"; // Importing data

const TopSocialGames = () => {
  const [selectedSport, setSelectedSport] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const gamesPerPage = 3; // Max 3 games per page

  // Filter available games & by selected sport
  const filteredGames = socialGames.filter(
    (game) => game.status === "Available" && (selectedSport === "All" || game.sport === selectedSport)
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredGames.length / gamesPerPage) || 1;

  // Get games for the current page
  const currentGames = filteredGames.slice(
    (currentPage - 1) * gamesPerPage,
    currentPage * gamesPerPage
  );

  // Pagination Handlers
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <section className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Top Social Games</h2>

      {/* Sport Filter Tabs */}
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {["All", "Badminton", "Pickleball", "Futsal"].map((game) => (
          <button
            key={game}
            className={`px-4 py-2 border rounded-lg ${
              selectedSport === game ? "bg-gray-300" : "hover:bg-gray-100"
            }`}
            onClick={() => {
              setSelectedSport(game);
              setCurrentPage(1);
            }}
          >
            {game}
          </button>
        ))}
      </div>

      {/* Games Grid (Paginated) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {currentGames.length > 0 ? (
          currentGames.map((game) => (
            <Card key={game.id} className="border rounded-lg h-64">
              <img
                src={game.image}
                alt={game.name}
                className="h-32 w-full object-cover"
              />
              <CardContent>
                <h3 className="text-xl font-medium">{game.name}</h3>
                <p className="text-sm text-gray-500">{game.location}</p>
                <p className="text-sm text-gray-500">{game.date} - {game.time}</p>
                <p className="text-sm text-gray-500">Looking for players</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-gray-500">No available games for {selectedSport}.</p>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-6">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 border rounded-lg ${
              currentPage === 1 ? "bg-gray-200 cursor-not-allowed" : "hover:bg-gray-100"
            }`}
          >
            Previous
          </button>
          <span className="text-lg font-semibold">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 border rounded-lg ${
              currentPage === totalPages ? "bg-gray-200 cursor-not-allowed" : "hover:bg-gray-100"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
};

export default TopSocialGames;

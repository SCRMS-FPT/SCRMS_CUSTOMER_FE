import React from 'react';
import { Search } from 'lucide-react';
import { Card,Button, CardContent } from '@mui/material';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-cover bg-center h-[400px] text-white flex items-center justify-center" style={{ backgroundImage: `url('/path/to/your/hero-image.jpg')` }}>
        <div className="text-center">
          <h1 className="text-4xl font-bold">Get Active, Book Your Games Now</h1>
          <p className="mt-2 text-lg">From favorites like badminton and futsal to trendy pickleball and frisbee!</p>
          <div className="mt-6 flex justify-center items-center gap-2 bg-white text-black p-4 rounded-lg shadow-lg">
            <input className="border p-2 rounded-md w-[200px]" type="text" placeholder="Select a sport" />
            <input className="border p-2 rounded-md w-[200px]" type="text" placeholder="Search venue name, city, or state" />
            <label htmlFor="date-picker" className="sr-only">Select a date</label>
            <input id="date-picker" className="border p-2 rounded-md w-[200px]" type="date" />
            <Button><Search size={20} /> Search</Button>
          </div>
        </div>
      </div>

      {/* Featured Venues */}
      <section className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Featured Venues</h2>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {/* Tabs for different sports */}
          {['Pickleball', 'Badminton', 'Futsal', 'Volleyball'].map((sport) => (
            <button key={sport} className="px-4 py-2 border rounded-lg hover:bg-gray-100">
              {sport}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {[1, 2, 3, 4, 5, 6].map((venue) => (
            <Card key={venue} className="border rounded-lg">
              <img src={`/path/to/venue-${venue}.jpg`} alt="Venue" className="h-40 w-full object-cover" />
              <CardContent>
                <h3 className="text-xl font-medium">Venue Name {venue}</h3>
                <p className="text-sm text-gray-500">Location {venue}</p>
                <div className="flex justify-between mt-2">
                <Button variant="outlined">View</Button>

                  <Button>Book Now</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pickleball Wave Info Cards */}
      <section className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Pickleball Wave: All You Need To Know!</h2>
        <div className="flex space-x-4 overflow-x-auto">
          {["Rules & Basics", "Tips & Tricks", "Pickleball vs. Badminton", "Popular Courts"].map((info) => (
            <Card key={info} className="w-48 border rounded-lg">
              <CardContent>
                <h3 className="text-lg font-medium">{info}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stay Active Section */}
      <section className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Stay Active, Stay Safe</h2>
        <div className="flex space-x-4 overflow-x-auto">
          {["Courtside Community", "Create Positive Environment", "Emergency Hotlines", "Warm-up Before Game"].map((tip) => (
            <Card key={tip} className="w-48 border rounded-lg">
              <CardContent>
                <h3 className="text-lg font-medium">{tip}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Top Social Games */}
      <section className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Top Social Games</h2>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {['All', 'Badminton', 'Pickleball', 'Futsal'].map((game) => (
            <button key={game} className="px-4 py-2 border rounded-lg hover:bg-gray-100">
              {game}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {[1, 2, 3].map((game) => (
            <Card key={game} className="border rounded-lg">
              <CardContent>
                <h3 className="text-xl font-medium">Game {game}</h3>
                <p className="text-sm text-gray-500">Location for game {game}</p>
                <p className="text-sm text-gray-500">Date & Time</p>
                <p className="text-sm text-gray-500">Looking for players</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;

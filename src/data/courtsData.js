import basketballCourt01 from "../assets/basketball_court_01.jpg";

const courtsData = [
    {
        id: 1,
        name: "Kingdom University",
        city: "Manama",
        address: "123 University Road, Manama, Bahrain",
        availableHours: { start: "08:00", end: "22:00" },
        description: "The Kingdom University sports complex is a state-of-the-art facility that offers a variety of sports activities. The basketball court is one of the most popular spots in the complex.",
        durations: [60, 90, 120],
        pricePerHour: 10.5,
        sport: ["Basketball", "Football", "Volleyball"],
        image: "/images/court1.jpg",
        image_details: [
            basketballCourt01,
            "/images/court2.jpg",
            "/images/court3.jpg"
        ],
        rating: 5,
        dateRange: { start: "2025-02-20", end: "2025-03-06" },
        status: "available",
        ownerId: 101
    },
    {
        id: 2,
        name: "Elite Sports Arena",
        city: "Riffa",
        address: "456 Sports Street, Riffa, Bahrain",
        availableHours: { start: "09:00", end: "23:00" },
        description: "",
        durations: [60, 90],
        pricePerHour: 15.0,
        sport: ["Basketball", "Tennis"],
        image: "/images/court2.jpg",
        image_details: [
            "/images/court1.jpg",
            "/images/court2.jpg",
            "/images/court3.jpg"
        ],
        rating: 4.8,
        dateRange: { start: "2025-02-18", end: "2025-03-06" },
        status: "unavailable"
    },
    {
        id: 3,
        name: "Champion's Dome",
        city: "Muharraq",
        address: "789 Champion Avenue, Muharraq, Bahrain",
        availableHours: { start: "07:00", end: "21:00" },
        description: "Champion's Dome is known for its excellent facilities and vibrant sports community.",
        durations: [90, 120],
        pricePerHour: 12.75,
        sport: ["Volleyball", "Football"],
        image: "/images/court3.jpg",
        image_details: [
            "/images/court1.jpg",
            "/images/court2.jpg",
            "/images/court3.jpg"
        ],
        rating: 4.6,
        dateRange: { start: "2025-02-15", end: "2025-03-06" },
        status: "available"
    },
    {
        id: 4,
        name: "The Grand Court",
        city: "Manama",
        address: "321 Prestige Road, Manama, Bahrain",
        availableHours: { start: "06:00", end: "22:00" },
        description: "",
        durations: [60, 120],
        pricePerHour: 18.0,
        sport: ["Tennis", "Basketball"],
        image: "/images/court4.jpg",
        image_details: [
            "/images/court1.jpg",
            "/images/court2.jpg",
            "/images/court3.jpg"
        ],
        rating: 4.9,
        dateRange: { start: "2025-02-22", end: "2025-03-06" },
        status: "unavailable"
    },
    {
        id: 5,
        name: "Victory Sports Hall",
        city: "Isa Town",
        address: "654 Victory Lane, Isa Town, Bahrain",
        availableHours: { start: "10:00", end: "20:00" },
        description: "Victory Sports Hall offers a wide range of sports facilities and is a favorite among locals.",
        durations: [60, 90, 120],
        pricePerHour: 14.25,
        sport: ["Badminton", "Basketball"],
        image: "/images/court5.jpg",
        image_details: [
            "/images/court1.jpg",
            "/images/court2.jpg",
            "/images/court3.jpg"
        ],
        rating: 4.5,
        dateRange: { start: "2025-02-19", end: "2025-03-06" },
        status: "available"
    },
    {
        id: 6,
        name: "Legends Arena",
        city: "Hamad Town",
        address: "987 Legends Street, Hamad Town, Bahrain",
        availableHours: { start: "07:30", end: "22:30" },
        description: "",
        durations: [60, 90],
        pricePerHour: 16.75,
        sport: ["Football", "Tennis"],
        image: "/images/court6.jpg",
        image_details: [
            "/images/court1.jpg",
            "/images/court2.jpg",
            "/images/court3.jpg"
        ],
        rating: 4.7,
        dateRange: { start: "2025-02-17", end: "2025-03-06" },
        status: "available"
    },
    {
        id: 7,
        name: "Olympic Sports Complex",
        city: "Riffa",
        address: "369 Olympic Road, Riffa, Bahrain",
        availableHours: { start: "08:00", end: "23:00" },
        description: "Olympic Sports Complex is a premier destination for sports enthusiasts.",
        durations: [60, 90, 120],
        pricePerHour: 20.0,
        sport: ["Basketball", "Volleyball", "Badminton"],
        image: "/images/court7.jpg",
        image_details: [
            "/images/court1.jpg",
            "/images/court2.jpg",
            "/images/court3.jpg"
        ],
        rating: 5,
        dateRange: { start: "2025-02-21", end: "2025" },
        status: "unavailable"
    },
    {
        id: 8,
        name: "Rising Stars Court",
        city: "Muharraq",
        address: "147 Stars Avenue, Muharraq, Bahrain",
        availableHours: { start: "06:00", end: "21:00" },
        description: "",
        durations: [90, 120],
        price: 11.0,
        sport: ["Tennis", "Badminton"],
        image: "/images/court8.jpg",
        image_details: [
            "/images/court1.jpg",
            "/images/court2.jpg",
            "/images/court3.jpg"
        ],
        rating: 4.4,
        date: "2025-02-16",
        status: "available"
    },
    {
        id: 9,
        name: "The Dome Sports Hub",
        city: "Sitra",
        address: "852 Dome Drive, Sitra, Bahrain",
        availableHours: { start: "09:00", end: "22:00" },
        description: "The Dome Sports Hub is known for its excellent facilities and vibrant sports community.",
        durations: [60, 120],
        price: 13.5,
        sport: ["Football", "Volleyball"],
        image: "/images/court9.jpg",
        image_details: [
            "/images/court1.jpg",
            "/images/court2.jpg",
            "/images/court3.jpg"
        ],
        rating: 4.6,
        date: "2025-02-23",
        status: "available"
    },
    {
        id: 10,
        name: "Falcon Sports Arena",
        city: "Manama",
        address: "753 Falcon Street, Manama, Bahrain",
        availableHours: { start: "07:00", end: "21:30" },
        description: "",
        durations: [60, 90],
        price: 17.0,
        sport: ["Basketball", "Football"],
        image: "/images/court10.jpg",
        image_details: [
            "/images/court1.jpg",
            "/images/court2.jpg",
            "/images/court3.jpg"
        ],
        rating: 4.8,
        date: "2025-02-14",
        status: "unavailable"
    },
    {
        id: 11,
        name: "Pro League Courts",
        city: "Hamad Town",
        address: "369 Pro League Ave, Hamad Town, Bahrain",
        availableHours: { start: "08:00", end: "20:00" },
        description: "Pro League Courts is a favorite among professional athletes.",
        durations: [90, 120],
        price: 15.5,
        sport: ["Volleyball", "Tennis"],
        image: "/images/court11.jpg",
        image_details: [
            "/images/court1.jpg",
            "/images/court2.jpg",
            "/images/court3.jpg"
        ],
        rating: 4.7,
        date: "2025-02-20",
        status: "available"
    },
    {
        id: 12,
        name: "Arena 24",
        city: "Isa Town",
        address: "159 Arena Boulevard, Isa Town, Bahrain",
        availableHours: { start: "24:00", end: "24:00" },
        description: "",
        durations: [60, 90, 120],
        price: 22.0,
        sport: ["Basketball", "Badminton", "Football"],
        image: "/images/court12.jpg",
        image_details: [
            "/images/court1.jpg",
            "/images/court2.jpg",
            "/images/court3.jpg"
        ],
        rating: 5,
        date: "2025-02-25",
        status: "available"
    },
    {
        id: 13,
        name: "Bahrain Sports City",
        city: "Sitra",
        address: "951 Sports City Road, Sitra, Bahrain",
        availableHours: { start: "07:00", end: "23:00" },
        description: "Bahrain Sports City is a premier destination for sports enthusiasts.",
        durations: [60, 90, 120],
        price: 19.5,
        sport: ["Football", "Tennis", "Volleyball"],
        image: "/images/court13.jpg",
        image_details: [
            "/images/court1.jpg",
            "/images/court2.jpg",
            "/images/court3.jpg"
        ],
        rating: 4.9,
        date: "2025-02-24",
        status: "unavailable"
    },
    {
        id: 14,
        name: "Sunrise Sports Club",
        city: "Manama",
        address: "111 Sunrise Street, Manama, Bahrain",
        availableHours: { start: "06:00", end: "22:00" },
        description: "",
        durations: [60, 90, 120],
        price: 12.0,
        sport: ["Basketball", "Tennis"],
        image: "/images/court14.jpg",
        image_details: [
            "/images/court1.jpg",
            "/images/court2.jpg",
            "/images/court3.jpg"
        ],
        rating: 4.6,
        date: "2025-02-20",
        status: "available"
    },
    {
        id: 15,
        name: "Victory Arena",
        city: "Riffa",
        address: "222 Victory Road, Riffa, Bahrain",
        availableHours: { start: "09:00", end: "23:00" },
        description: "Victory Arena offers a wide range of sports facilities and is a favorite among locals.",
        durations: [60, 90],
        price: 16.5,
        sport: ["Football", "Volleyball"],
        image: "/images/court15.jpg",
        image_details: [
            "/images/court1.jpg",
            "/images/court2.jpg",
            "/images/court3.jpg"
        ],
        rating: 4.8,
        date: "2025-02-22",
        status: "available"
    },
    {
        id: 16,
        name: "Champion Grounds",
        city: "Muharraq",
        address: "333 Champion Street, Muharraq, Bahrain",
        availableHours: { start: "07:00", end: "21:00" }, // Court working hours
        description: "",
        durations: [90, 120], // Available match durations
        pricePerHour: 14.0,
        sport: ["Badminton", "Basketball"],
        image: "/images/court16.jpg",
        image_details: [
            "/images/court1.jpg",
            "/images/court2.jpg",
            "/images/court3.jpg"
        ],
        rating: 4.7,
        dateRange: { start: "2025-02-18", end: "2025-03-06" }, // Available date range
        status: "available"
    },    
    {
        id: 17,
        name: "City Sports Complex",
        city: "Sitra",
        address: "444 City Lane, Sitra, Bahrain",
        availableHours: { start: "08:00", end: "22:00" },
        description: "City Sports Complex is known for its excellent facilities and vibrant sports community.",
        durations: [60, 120],
        price: 17.5,
        sport: ["Basketball", "Football", "Tennis"],
        image: "/images/court17.jpg",
        image_details: [
            "/images/court1.jpg",
            "/images/court2.jpg",
            "/images/court3.jpg"
        ],
        rating: 4.9,
        date: "2025-02-19",
        status: "available"
    },
    {
        id: 18,
        name: "Golden Sports Hub",
        city: "Isa Town",
        address: "555 Golden Street, Isa Town, Bahrain",
        availableHours: { start: "10:00", end: "20:00" },
        description: "",
        durations: [60, 90, 120],
        price: 13.75,
        sport: ["Volleyball", "Tennis"],
        image: "/images/court18.jpg",
        image_details: [
            "/images/court1.jpg",
            "/images/court2.jpg",
            "/images/court3.jpg"
        ],
        rating: 4.5,
        date: "2025-02-21",
        status: "available"
    },
    {
        id: 19,
        name: "Legends Hall",
        city: "Hamad Town",
        address: "666 Legends Avenue, Hamad Town, Bahrain",
        availableHours: { start: "07:30", end: "22:30" },
        description: "Legends Hall is a favorite among professional athletes.",
        durations: [60, 90],
        price: 18.0,
        sport: ["Football", "Badminton"],
        image: "/images/court19.jpg",
        image_details: [
            "/images/court1.jpg",
            "/images/court2.jpg",
            "/images/court3.jpg"
        ],
        rating: 4.7,
        date: "2025-02-24",
        status: "available"
    },
    {
        id: 20,
        name: "Olympus Sports Arena",
        city: "Riffa",
        address: "777 Olympus Drive, Riffa, Bahrain",
        availableHours: { start: "08:00", end: "23:00" },
        description: "",
        durations: [60, 90, 120],
        price: 20.0,
        sport: ["Basketball", "Volleyball"],
        image: "/images/court20.jpg",
        image_details: [
            "/images/court1.jpg",
            "/images/court2.jpg",
            "/images/court3.jpg"
        ],
        rating: 5,
        date: "2025-02-26",
        status: "available"
    },
    {
        id: 21,
        name: "Coastal Sports Hub",
        city: "Muharraq",
        address: "888 Coastal Road, Muharraq, Bahrain",
        availableHours: { start: "06:00", end: "21:00" },
        description: "Coastal Sports Hub is known for its excellent facilities and vibrant sports community.",
        durations: [90, 120],
        price: 11.5,
        sport: ["Tennis", "Badminton"],
        image: "/images/court21.jpg",
        image_details: [
            "/images/court1.jpg",
            "/images/court2.jpg",
            "/images/court3.jpg"
        ],
        rating: 4.4,
        date: "2025-02-27",
        status: "available"
    },
    {
        id: 22,
        name: "The Dome Elite Sports",
        city: "Sitra",
        address: "999 Dome Lane, Sitra, Bahrain",
        availableHours: { start: "09:00", end: "22:00" },
        description: "",
        durations: [60, 120],
        price: 14.0,
        sport: ["Football", "Volleyball"],
        image: "/images/court22.jpg",
        image_details: [
            "/images/court1.jpg",
            "/images/court2.jpg",
            "/images/court3.jpg"
        ],
        rating: 4.6,
        date: "2025-02-28",
        status: "available"
    },
    {
        id: 23,
        name: "Falcon Sports Club",
        city: "Manama",
        address: "101 Falcon Street, Manama, Bahrain",
        availableHours: { start: "07:00", end: "21:30" },
        description: "Falcon Sports Club offers a wide range of sports facilities and is a favorite among locals.",
        durations: [60, 90],
        price: 19.0,
        sport: ["Basketball", "Football"],
        image: "/images/court23.jpg",
        image_details: [
            "/images/court1.jpg",
            "/images/court2.jpg",
            "/images/court3.jpg"
        ],
        rating: 4.8,
        date: "2025-02-29",
        status: "available"
    },
    {
        id: 16,
        name: "Royal Sports Academy",
        city: "Manama",
        address: "777 Royal Avenue, Manama, Bahrain",
        availableHours: { start: "08:00", end: "21:00" },
        description: "A premium sports facility with modern courts and top-notch amenities.",
        durations: [60, 90, 120],
        price: 18.5,
        sport: ["Basketball", "Tennis"],
        image: "/images/court16.jpg",
        image_details: [
            "/images/court16_1.jpg",
            "/images/court16_2.jpg",
            "/images/court16_3.jpg"
        ],
        rating: 4.7,
        date: "2025-03-04",
        status: "available"
    },
    {
        id: 17,
        name: "Eagle Sports Hub",
        city: "Riffa",
        address: "555 Eagle Street, Riffa, Bahrain",
        availableHours: { start: "07:30", end: "22:30" },
        description: "A favorite spot for sports enthusiasts, featuring multiple courts for different activities.",
        durations: [60, 90],
        price: 14.75,
        sport: ["Basketball", "Volleyball", "Football"],
        image: "/images/court17.jpg",
        image_details: [
            "/images/court17_1.jpg",
            "/images/court17_2.jpg",
            "/images/court17_3.jpg"
        ],
        rating: 4.8,
        date: "2025-03-04",
        status: "available"
    },
    {
        id: 18,
        name: "Titan Sports Complex",
        city: "Hamad Town",
        address: "888 Titan Boulevard, Hamad Town, Bahrain",
        availableHours: { start: "06:00", end: "23:00" },
        description: "A well-equipped sports complex with professional-grade basketball courts.",
        durations: [60, 120],
        price: 20.0,
        sport: ["Basketball", "Badminton"],
        image: "/images/court18.jpg",
        image_details: [
            "/images/court18_1.jpg",
            "/images/court18_2.jpg",
            "/images/court18_3.jpg"
        ],
        rating: 5,
        date: "2025-03-05",
        status: "unavailable"
    },
    {
        id: 19,
        name: "Champion Elite Courts",
        city: "Isa Town",
        address: "123 Elite Street, Isa Town, Bahrain",
        availableHours: { start: "09:00", end: "21:30" },
        description: "An elite training facility for aspiring basketball players.",
        durations: [60, 90, 120],
        price: 19.5,
        sport: ["Basketball", "Tennis"],
        image: "/images/court19.jpg",
        image_details: [
            "/images/court19_1.jpg",
            "/images/court19_2.jpg",
            "/images/court19_3.jpg"
        ],
        rating: 4.9,
        date: "2025-03-04",
        status: "available"
    },
    {
        id: 20,
        name: "Sunset Sports Arena",
        city: "Muharraq",
        address: "321 Sunset Lane, Muharraq, Bahrain",
        availableHours: { start: "08:30", end: "22:00" },
        description: "A modern facility with scenic views and well-maintained courts.",
        durations: [60, 90],
        price: 15.0,
        sport: ["Basketball", "Football"],
        image: "/images/court20.jpg",
        image_details: [
            "/images/court20_1.jpg",
            "/images/court20_2.jpg",
            "/images/court20_3.jpg"
        ],
        rating: 4.6,
        date: "2025-03-04",
        status: "available"
    }
];

export default courtsData;

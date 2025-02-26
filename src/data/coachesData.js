const coachesData = [
    {
        id: 1,
        sport: "Football",
        name: "John Doe",
        location: "New York, USA",
        image: "/src/assets/HLV/2.jpg",
        image_details: [
            "/src/assets/HLV/2q.jpg",
            "/src/assets/HLV/2w.jpg"
        ],
        fee: 50,
        rating: 4.9,
        availableHours: { start: "08:00", end: "20:00" },
        description: "John Doe is an experienced football coach with a focus on youth training. He has over 15 years of experience coaching young athletes and helping them develop their skills. John has a proven track record of success, with many of his students going on to play at the collegiate and professional levels. He emphasizes the importance of teamwork, discipline, and hard work in his coaching philosophy.",
        specialties: ["Youth Training", "Fitness Training"],
        date: "2025-02-20",
        status: "available",
        contact: {
            email: "john.doe@example.com",
            phone: "+1 555-1234",
            website: "http://johndoe.com"
        },
        schedule: [
            { date: "2025-02-20", time: "10:00", booked: false },
            { date: "2025-02-20", time: "14:00", booked: true },
            { date: "2025-02-21", time: "09:00", booked: false },
        ]
    },
    {
        id: 2,
        sport: "Basketball",
        name: "Jane Smith",
        location: "Los Angeles, USA",
        image: "/src/assets/HLV/3.jpg",
        image_details: [
            "/src/assets/HLV/3q.jpg",
            "/src/assets/HLV/3w.jpg"
        ],
        fee: 60,
        rating: 4.8,
        availableHours: { start: "09:00", end: "18:00" },
        description: "Jane Smith is a professional basketball coach with a background in college basketball. She has coached at various levels, from high school to college, and has a deep understanding of the game. Jane is known for her ability to develop players' skills and improve their performance on the court. She focuses on fundamentals, strategy, and mental toughness, and has helped many players achieve their goals of playing at higher levels.",
        specialties: ["College Basketball", "Fitness Training"],
        date: "2025-02-18",
        status: "available",
        contact: {
            email: "jane.smith@example.com",
            phone: "+1 555-5678",
            website: "http://janesmith.com"
        },
        schedule: [
            { date: "2025-02-18", time: "11:00", booked: false },
            { date: "2025-02-18", time: "15:00", booked: true },
            { date: "2025-02-19", time: "10:00", booked: false },
        ]
    },
    {
        id: 3,
        sport: "Tennis",
        name: "Alice Johnson",
        location: "Chicago, USA",
        image: "/src/assets/HLV/4.jpg",
        image_details: [
            "/src/assets/HLV/4q.jpg",
            "/src/assets/HLV/4w.jpg"
        ],
        fee: 70,
        rating: 4.7,
        availableHours: { start: "07:00", end: "19:00" },
        description: "Alice Johnson is a certified tennis coach with over 10 years of experience. She has worked with players of all ages and skill levels, from beginners to advanced competitors. Alice's coaching style is focused on technique, strategy, and physical conditioning. She is dedicated to helping her students improve their game and achieve their personal best. Alice has a passion for tennis and enjoys sharing her knowledge and expertise with her students.",
        specialties: ["Tennis", "Fitness Training"],
        date: "2025-02-15",
        status: "available",
        contact: {
            email: "alice.johnson@example.com",
            phone: "+1 555-6789",
            website: "http://alicejohnson.com"
        },
        schedule: [
            { date: "2025-02-15", time: "08:00", booked: false },
            { date: "2025-02-15", time: "12:00", booked: true },
            { date: "2025-02-16", time: "09:00", booked: false },
        ]
    },
    {
        id: 4,
        sport: "Swimming",
        name: "Michael Phelps",
        location: "Baltimore, USA",
        image: "/src/assets/HLV/5.jpg",
        image_details: [
            "/src/assets/HLV/5q.jpg",
            "/src/assets/HLV/5w.jpg"
        ],
        fee: 80,
        rating: 5.0,
        availableHours: { start: "10:00", end: "18:00" },
        description: "Michael Phelps is an Olympic gold medalist offering swimming coaching for all levels. With a wealth of experience and knowledge, Michael provides expert guidance on technique, training, and competition preparation. He has a passion for swimming and is dedicated to helping his students achieve their goals. Michael's coaching philosophy is centered around hard work, dedication, and a positive attitude. He has helped many swimmers reach their full potential and excel in the sport.",
        specialties: ["Swimming", "Fitness Training"],
        date: "2025-02-17",
        status: "available",
        contact: {
            email: "michael.phelps@example.com",
            phone: "+1 555-7890",
            website: "http://michaelphelps.com"
        },
        schedule: [
            { date: "2025-02-17", time: "10:00", booked: false },
            { date: "2025-02-17", time: "14:00", booked: true },
            { date: "2025-02-18", time: "09:00", booked: false },
        ]
    },
    {
        id: 5,
        sport: "Soccer",
        name: "David Beckham",
        location: "London, UK",
        image: "/src/assets/HLV/6.jpg",
        image_details: [
            "/src/assets/HLV/6q.jpg",
            "/src/assets/HLV/6w.jpg"
        ],
        fee: 90,
        rating: 4.9,
        availableHours: { start: "08:00", end: "20:00" },
        description: "David Beckham is a former professional soccer player providing expert coaching. With a career spanning over two decades, David has played at the highest levels of the sport and brings a wealth of experience to his coaching. He focuses on developing players' technical skills, tactical understanding, and physical fitness. David is passionate about soccer and is committed to helping his students achieve their goals. He has a proven track record of success and has helped many players reach their full potential.",
        specialties: ["Soccer", "Fitness Training"],
        date: "2025-02-19",
        status: "available",
        contact: {
            email: "david.beckham@example.com",
            phone: "+44 20 7946 0958",
            website: "http://davidbeckham.com"
        },
        schedule: [
            { date: "2025-02-19", time: "10:00", booked: false },
            { date: "2025-02-19", time: "14:00", booked: true },
            { date: "2025-02-20", time: "09:00", booked: false },
        ]
    },
    {
        id: 6,
        sport: "Baseball",
        name: "Babe Ruth",
        location: "Boston, USA",
        image: "/src/assets/HLV/2.jpg",
        image_details: [
            "/src/assets/HLV/2.jpg",
            "//src/assets/HLV/2.jpg"
        ],
        fee: 65,
        rating: 4.8,
        availableHours: { start: "08:00", end: "20:00" },
        description: "Babe Ruth is a legendary baseball player offering coaching for aspiring athletes. With a storied career and numerous accolades, Babe brings unparalleled expertise to his coaching. He focuses on developing players' hitting, pitching, and fielding skills, as well as their overall understanding of the game. Babe is dedicated to helping his students improve their performance and achieve their goals. His coaching philosophy is centered around hard work, dedication, and a love for the game.",
        specialties: ["Baseball", "Fitness Training"],
        date: "2025-02-16",
        status: "available",
        contact: {
            email: "babe.ruth@example.com",
            phone: "+1 555-8901",
            website: "http://baberuth.com"
        },
        schedule: [
            { date: "2025-02-16", time: "10:00", booked: false },
            { date: "2025-02-16", time: "14:00", booked: true },
            { date: "2025-02-17", time: "09:00", booked: false },
        ]
    },
    {
        id: 7,
        sport: "Volleyball",
        name: "Kerri Walsh",
        location: "San Francisco, USA",
        image: "/src/assets/HLV/2.jpg",
        image_details: [
            "/src/assets/HLV/2.jpg",
            "/src/assets/HLV/2.jpg"
        ],
        fee: 75,
        rating: 4.7,
        availableHours: { start: "09:00", end: "18:00" },
        description: "Kerri Walsh is a professional volleyball coach with a focus on beach volleyball. With a successful career as a player, Kerri brings a wealth of knowledge and experience to her coaching. She focuses on developing players' technical skills, tactical understanding, and physical fitness. Kerri is passionate about volleyball and is dedicated to helping her students achieve their goals. She has a proven track record of success and has helped many players reach their full potential.",
        specialties: ["Beach Volleyball", "Fitness Training"],
        date: "2025-02-18",
        status: "available",
        contact: {
            email: "kerri.walsh@example.com",
            phone: "+1 555-9012",
            website: "http://kerriwalsh.com"
        },
        schedule: [
            { date: "2025-02-18", time: "10:00", booked: false },
            { date: "2025-02-18", time: "14:00", booked: true },
            { date: "2025-02-19", time: "09:00", booked: false },
        ]
    },
    {
        id: 8,
        sport: "Gymnastics",
        name: "Simone Biles",
        location: "Houston, USA",
        image: "/src/assets/HLV/2.jpg",
        image_details: [
            "/src/assets/HLV/2.jpg",
            "/src/assets/HLV/2.jpg"
        ],
        fee: 85,
        rating: 5.0,
        availableHours: { start: "08:00", end: "20:00" },
        description: "Simone Biles is a world champion gymnast offering coaching for all skill levels. With numerous accolades and a wealth of experience, Simone provides expert guidance on technique, training, and competition preparation. She is dedicated to helping her students achieve their goals and reach their full potential. Simone's coaching philosophy is centered around hard work, dedication, and a positive attitude. She has a passion for gymnastics and enjoys sharing her knowledge and expertise with her students.",
        specialties: ["Gymnastics", "Fitness Training"],
        date: "2025-02-21",
        status: "available",
        contact: {
            email: "simone.biles@example.com",
            phone: "+1 555-0123",
            website: "http://simonebiles.com"
        },
        schedule: [
            { date: "2025-02-21", time: "10:00", booked: false },
            { date: "2025-02-21", time: "14:00", booked: true },
            { date: "2025-02-22", time: "09:00", booked: false },
        ]
    },
    {
        id: 9,
        sport: "Boxing",
        name: "Muhammad Ali",
        location: "Louisville, USA",
        image: "/src/assets/HLV/2.jpg",
        image_details: [
            "/src/assets/HLV/2.jpg",
            "/src/assets/HLV/2.jpg"
        ],
        fee: 100,
        rating: 5.0,
        availableHours: { start: "08:00", end: "20:00" },
        description: "Muhammad Ali is a legendary boxer providing expert coaching and training. With a storied career and numerous accolades, Muhammad brings unparalleled expertise to his coaching. He focuses on developing fighters' technical skills, tactical understanding, and physical fitness. Muhammad is dedicated to helping his students improve their performance and achieve their goals. His coaching philosophy is centered around hard work, dedication, and a love for the sport.",
        specialties: ["Boxing", "Fitness Training"],
        date: "2025-02-22",
        status: "available",
        contact: {
            email: "muhammad.ali@example.com",
            phone: "+1 555-1234",
            website: "http://muhammadali.com"
        },
        schedule: [
            { date: "2025-02-22", time: "10:00", booked: false },
            { date: "2025-02-22", time: "14:00", booked: true },
            { date: "2025-02-23", time: "09:00", booked: false },
        ]
    },
    {
        id: 10,
        sport: "Golf",
        name: "Tiger Woods",
        location: "Orlando, USA",
        image: "/src/assets/HLV/2.jpg",
        image_details: [
            "/src/assets/HLV/2.jpg",
            "/src/assets/HLV/2.jpg"
        ],
        fee: 120,
        rating: 4.9,
        availableHours: { start: "08:00", end: "20:00" },
        description: "Tiger Woods is a professional golfer offering coaching for all levels. With a successful career and numerous accolades, Tiger brings a wealth of knowledge and experience to his coaching. He focuses on developing players' technical skills, tactical understanding, and physical fitness. Tiger is passionate about golf and is dedicated to helping his students achieve their goals. He has a proven track record of success and has helped many players reach their full potential.",
        specialties: ["Golf", "Fitness Training"],
        date: "2025-02-23",
        status: "available",
        contact: {
            email: "tiger.woods@example.com",
            phone: "+1 555-2345",
            website: "http://tigerwoods.com"
        },
        schedule: [
            { date: "2025-02-23", time: "10:00", booked: false },
            { date: "2025-02-23", time: "14:00", booked: true },
            { date: "2025-02-24", time: "09:00", booked: false },
        ]
    }
    // Add more coach data here...
];

export default coachesData;
export const venuesData = [
  {
    "id": "venue_12345",
    "name": "Elite Sports Center",
    "owner_id": "owner_67890",
    "address": {
      "street": "123 Sports Avenue",
      "city": "New York",
      "state": "NY",
      "zip_code": "10001",
      "country": "USA",
      "latitude": 40.712776,
      "longitude": -74.005974
    },
    "contact_info": {
      "phone": "+1 555-1234",
      "email": "contact@elitesports.com",
      "website": "https://elitesports.com"
    },
    "sports_available": ["Tennis", "Basketball", "Badminton"],
    "amenities": [
      "Parking",
      "Locker Rooms",
      "Showers",
      "Cafeteria",
      "Wi-Fi"
    ],
    "courts": [
      "court_001",
      "court_002",
      "court_003"
    ],
    "membership_required": false,
    "images": [
      "https://example.com/elite1.jpg",
      "https://example.com/elite2.jpg"
    ],
    "operating_hours": {
      "monday": { "open": "07:00", "close": "22:00" },
      "tuesday": { "open": "07:00", "close": "22:00" },
      "wednesday": { "open": "07:00", "close": "22:00" },
      "thursday": { "open": "07:00", "close": "22:00" },
      "friday": { "open": "07:00", "close": "23:00" },
      "saturday": { "open": "08:00", "close": "23:00" },
      "sunday": { "open": "08:00", "close": "20:00" }
    },
    "rating": 4.7,
    "reviews": [
      {
        "user_id": "player_111",
        "rating": 5,
        "comment": "Excellent facilities and well-maintained courts.",
        "date": "2024-03-15T14:30:00Z"
      },
      {
        "user_id": "player_222",
        "rating": 4,
        "comment": "Great place, but parking is limited.",
        "date": "2024-03-12T10:00:00Z"
      }
    ],
    "pricing_model": {
      "hourly_rate": {
        "Tennis": 20,
        "Basketball": 15,
        "Badminton": 10
      },
      "membership_discount": 10
    },
    "booking_policy": {
      "cancellation_period": "24 hours",
      "modification_allowed": true,
      "advance_booking_limit": "30 days"
    },
    "created_at": "2023-09-10T08:00:00Z",
    "updated_at": "2024-03-15T12:00:00Z"
  },
  {
    "id": "venue_67890",
    "name": "Champion Arena",
    "owner_id": "owner_12345",
    "address": {
      "street": "456 Victory Road",
      "city": "Los Angeles",
      "state": "CA",
      "zip_code": "90001",
      "country": "USA",
      "latitude": 34.052235,
      "longitude": -118.243683
    },
    "contact_info": {
      "phone": "+1 555-5678",
      "email": "info@championarena.com",
      "website": "https://championarena.com"
    },
    "sports_available": ["Soccer", "Basketball", "Volleyball"],
    "amenities": [
      "Parking",
      "Cafeteria",
      "Restrooms",
      "Equipment Rental"
    ],
    "courts": [
      "court_101",
      "court_102"
    ],
    "membership_required": true,
    "images": [
      "https://example.com/champion1.jpg",
      "https://example.com/champion2.jpg"
    ],
    "operating_hours": {
      "monday": { "open": "06:00", "close": "22:00" },
      "tuesday": { "open": "06:00", "close": "22:00" },
      "wednesday": { "open": "06:00", "close": "22:00" },
      "thursday": { "open": "06:00", "close": "22:00" },
      "friday": { "open": "06:00", "close": "23:00" },
      "saturday": { "open": "07:00", "close": "23:00" },
      "sunday": { "open": "07:00", "close": "21:00" }
    },
    "rating": 4.5,
    "reviews": [
      {
        "user_id": "player_333",
        "rating": 5,
        "comment": "Fantastic place for soccer lovers!",
        "date": "2024-02-20T11:00:00Z"
      }
    ],
    "pricing_model": {
      "hourly_rate": {
        "Soccer": 25,
        "Basketball": 18,
        "Volleyball": 12
      },
      "membership_discount": 15
    },
    "booking_policy": {
      "cancellation_period": "48 hours",
      "modification_allowed": false,
      "advance_booking_limit": "14 days"
    },
    "created_at": "2023-10-05T09:00:00Z",
    "updated_at": "2024-02-20T10:00:00Z"
  }
];

export default venuesData;

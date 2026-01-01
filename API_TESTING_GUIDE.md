# PollutionX API Testing Guide

This document provides examples and test data for testing the PollutionX API endpoints with Postman or other API testing tools.

## Base URL

```
http://localhost:3000  (Updated from 3001)
```

## ✅ Database Status

- **MongoDB Atlas**: Connected successfully
- **Hotspots Collection**: 31 records (including sample Bhubaneswar data)
- **Reports Collection**: 3 sample community reports
- **All API endpoints**: Fully functional with real data

---

## 🔥 Hotspots API (`/api/hotspots`)

### GET /api/hotspots

Fetch hotspots with optional filtering and pagination.

**Query Parameters:**

- `limit` (number, default: 50): Number of records per page
- `page` (number, default: 1): Page number
- `type` (string): Filter by pollution type (fire, industrial, vehicular, natural, other)
- `minAqi` (number): Minimum AQI value
- `maxAqi` (number): Maximum AQI value

**Examples:**

```bash
# Get all hotspots (first 50)
GET http://localhost:3001/api/hotspots

# Get hotspots with pagination
GET http://localhost:3001/api/hotspots?page=2&limit=20

# Filter by pollution type
GET http://localhost:3001/api/hotspots?type=industrial

# Filter by AQI range
GET http://localhost:3001/api/hotspots?minAqi=100&maxAqi=300

# Combined filters
GET http://localhost:3001/api/hotspots?type=fire&minAqi=200&page=1&limit=10
```

**Response Format:**

```json
{
  "success": true,
  "data": [...hotspots],
  "pagination": {
    "current": 1,
    "total": 5,
    "count": 10,
    "totalRecords": 42
  }
}
```

### POST /api/hotspots

Create new hotspot(s). Accepts both single objects and arrays.

**Headers:**

```
Content-Type: application/json
```

**Single Hotspot Example:**

```json
{
  "name": "Industrial Zone Alpha",
  "lat": 20.2961,
  "lng": 85.8245,
  "intensity": 125.5,
  "aqi": 185,
  "type": "industrial",
  "source": "Chemical processing plant emissions",
  "recommendation": "Install advanced air filtration systems and monitor emissions regularly"
}
```

**Multiple Hotspots Example:**

```json
[
  {
    "name": "Highway Junction Pollution",
    "lat": 20.27,
    "lng": 85.84,
    "intensity": 95.2,
    "aqi": 145,
    "type": "vehicular",
    "source": "Heavy traffic congestion",
    "recommendation": "Implement traffic management and promote public transport"
  },
  {
    "name": "Forest Fire Smoke",
    "lat": 20.32,
    "lng": 85.78,
    "intensity": 220.8,
    "aqi": 285,
    "type": "fire",
    "source": "Wildfire in nearby forest area",
    "recommendation": "Evacuate nearby residents and deploy firefighting resources"
  }
]
```

**Sample Bhubaneswar Hotspots Data:**

```json
[
  {
    "name": "Bhubaneswar Railway Station Area",
    "lat": 20.2538,
    "lng": 85.841,
    "intensity": 110.5,
    "aqi": 165,
    "type": "vehicular",
    "source": "High vehicle density and diesel emissions",
    "recommendation": "Improve traffic flow and increase green cover"
  },
  {
    "name": "Mancheswar Industrial Area",
    "lat": 20.235,
    "lng": 85.778,
    "intensity": 145.8,
    "aqi": 195,
    "type": "industrial",
    "source": "Manufacturing units and thermal power plant",
    "recommendation": "Enforce emission standards and install pollution control devices"
  },
  {
    "name": "Patia IT Hub",
    "lat": 20.35,
    "lng": 85.82,
    "intensity": 85.2,
    "aqi": 125,
    "type": "vehicular",
    "source": "IT park traffic and construction activities",
    "recommendation": "Promote carpooling and improve public transport connectivity"
  },
  {
    "name": "Kalinga Stadium Area",
    "lat": 20.2825,
    "lng": 85.8275,
    "intensity": 75.5,
    "aqi": 110,
    "type": "vehicular",
    "source": "Event-related traffic congestion",
    "recommendation": "Better traffic management during events"
  }
]
```

---

## 📋 Reports API (`/api/reports`)

### GET /api/reports

Fetch community reports with optional filtering and pagination.

**Query Parameters:**

- `limit` (number, default: 50): Number of records per page
- `page` (number, default: 1): Page number
- `location` (string): Filter by location name (partial match)
- `search` (string): Text search across location and description
- `startDate` (ISO date): Filter reports after this date
- `endDate` (ISO date): Filter reports before this date

**Examples:**

```bash
# Get all reports
GET http://localhost:3001/api/reports

# Search reports
GET http://localhost:3001/api/reports?search=smoke

# Filter by location
GET http://localhost:3001/api/reports?location=Bhubaneswar

# Date range filter
GET http://localhost:3001/api/reports?startDate=2024-01-01&endDate=2024-12-31

# Combined filters
GET http://localhost:3001/api/reports?location=station&search=pollution&page=1&limit=20
```

### POST /api/reports

Create new report(s). Accepts both single objects and arrays.

**Headers:**

```
Content-Type: application/json
```

**Single Report Example:**

```json
{
  "locationName": "Bhubaneswar Bus Stand",
  "description": "Heavy black smoke from buses causing breathing difficulties for commuters",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Multiple Reports Example:**

```json
[
  {
    "locationName": "Khandagiri Square",
    "description": "Construction dust and vehicle emissions creating poor air quality",
    "timestamp": "2024-01-15T14:20:00.000Z"
  },
  {
    "locationName": "Nayapalli Market",
    "description": "Waste burning near market area producing toxic fumes",
    "timestamp": "2024-01-15T16:45:00.000Z"
  }
]
```

**Sample Bhubaneswar Reports Data:**

```json
[
  {
    "locationName": "Master Canteen Square",
    "description": "Dense vehicle exhaust fumes during peak hours causing visibility issues",
    "timestamp": "2024-01-15T08:30:00.000Z"
  },
  {
    "locationName": "Saheed Nagar Main Road",
    "description": "Road dust and construction particles affecting nearby residential areas",
    "timestamp": "2024-01-15T11:15:00.000Z"
  },
  {
    "locationName": "Unit 1 Market Complex",
    "description": "Plastic burning smell detected near market, possible illegal waste disposal",
    "timestamp": "2024-01-15T17:20:00.000Z"
  },
  {
    "locationName": "Jaydev Vihar",
    "description": "Unusual chemical odor from nearby industrial area affecting residents",
    "timestamp": "2024-01-15T19:45:00.000Z"
  }
]
```

---

## 🧪 Testing Checklist

### Hotspots API Tests:

- [ ] GET all hotspots
- [ ] GET hotspots with pagination
- [ ] GET hotspots filtered by type
- [ ] GET hotspots filtered by AQI range
- [ ] POST single hotspot
- [ ] POST multiple hotspots
- [ ] POST with invalid data (test validation)
- [ ] POST with missing required fields

### Reports API Tests:

- [ ] GET all reports
- [ ] GET reports with text search
- [ ] GET reports filtered by location
- [ ] GET reports with date range
- [ ] POST single report
- [ ] POST multiple reports
- [ ] POST with invalid timestamp
- [ ] POST with missing required fields

---

## 🔧 Error Response Format

All API endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error type",
  "details": ["Specific error messages"],
  "message": "Additional context"
}
```

**Common HTTP Status Codes:**

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `500`: Internal Server Error

---

## 💡 Pro Tips

1. **Use the limit parameter** to avoid large response payloads during testing
2. **Test with both valid and invalid data** to ensure error handling works
3. **Use the pagination parameters** to test large datasets
4. **Try different filter combinations** to test query flexibility
5. **Monitor the server console** for detailed error logs
6. **Use proper ISO date formats** for timestamp fields

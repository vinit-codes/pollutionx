# Bhubaneswar Urban Emission Tracker

A professional, full-stack environmental GIS tool for real-time pollution monitoring and community-verified hotspot reporting in Bhubaneswar, India.

## 🌍 Project Overview

This application addresses urban air quality monitoring by:

- Displaying real-time pollution hotspots on an interactive map
- Enabling community-verified pollution reporting
- Providing actionable insights for environmental action
- Supporting data-driven urban planning decisions

## ✨ Features

### 🗺️ Interactive Pollution Map

- Real-time visualization of 31+ pollution hotspots across Bhubaneswar
- Color-coded markers based on AQI levels (Green <200, Orange 200-300, Red >300)
- Dynamic pan and zoom functionality
- Detailed popup information for each hotspot

### 📊 Dashboard Analytics

- Total hotspots monitoring
- Critical areas tracking (AQI >300)
- Average city-wide AQI calculation
- Top emissions list sorted by severity

### 📍 Community Reporting

- Citizen science integration
- Report new pollution hotspots
- Categorize pollution types (vehicular, industrial, fire, construction, waste)
- Success notifications with toast messages

### 💻 Professional UI/UX

- Dark-themed modern interface
- Fully responsive design (mobile, tablet, desktop)
- Shadcn UI components
- Smooth animations and transitions
- Interactive sidebar with clickable hotspot cards

## 🛠️ Technology Stack

### Frontend

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Shadcn UI** - High-quality component library
- **React Leaflet** - Interactive maps
- **Sonner** - Toast notifications

### Backend

- **Next.js API Routes** - Serverless API endpoints
- **MongoDB Atlas** - Cloud database
- **Mongoose** - ODM for MongoDB

### GIS & Mapping

- **Leaflet.js** - Open-source mapping library
- **OpenStreetMap** - Map tiles

## 📁 Project Structure

```
pollutionx/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── hotspots/route.ts    # Hotspots CRUD API
│   │   │   └── reports/route.ts     # Reports submission API
│   │   ├── layout.tsx               # Root layout
│   │   ├── page.tsx                 # Main dashboard
│   │   └── globals.css              # Global styles
│   ├── components/
│   │   ├── Map.tsx                  # Interactive map component
│   │   ├── ReportHotspotDialog.tsx  # Report modal
│   │   └── ui/                      # Shadcn UI components
│   ├── hooks/
│   │   └── useHotspots.ts           # Data fetching hook
│   ├── lib/
│   │   ├── db.ts                    # MongoDB connection
│   │   └── utils.ts                 # Utility functions
│   └── models/
│       ├── Hotspot.ts               # Hotspot schema
│       └── Report.ts                # Report schema
├── scripts/
│   └── seed-data.js                 # Database seeding script
├── bhubaneswar-hotspots.json        # Initial data
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- npm or yarn

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd pollutionx
```

2. **Install dependencies**

```bash
npm install --legacy-peer-deps
```

3. **Set up environment variables**
   Create a `.env.local` file:

```env
MONGODB_URI=your_mongodb_connection_string
```

4. **Seed the database**

```bash
node scripts/seed-data.js
```

5. **Run the development server**

```bash
npm run dev
```

6. **Open the application**
   Navigate to `http://localhost:3000`

## 📡 API Endpoints

### Hotspots API

#### GET /api/hotspots

Retrieve pollution hotspots with optional filtering and pagination.

**Query Parameters:**

- `limit` - Number of results (default: 10)
- `page` - Page number (default: 1)
- `type` - Filter by pollution type
- `minAqi` - Minimum AQI filter
- `maxAqi` - Maximum AQI filter

**Response:**

```json
{
  "success": true,
  "data": [...hotspots],
  "pagination": {
    "current": 1,
    "total": 4,
    "count": 10,
    "totalRecords": 31
  }
}
```

#### POST /api/hotspots

Create a new hotspot (bulk or single).

**Request Body:**

```json
{
  "name": "Location Name",
  "lat": 20.2961,
  "lng": 85.8245,
  "aqi": 285,
  "intensity": 0.88,
  "type": "vehicular",
  "source": "Traffic congestion",
  "recommendation": "Traffic management"
}
```

### Reports API

#### GET /api/reports

Retrieve community reports.

#### POST /api/reports

Submit a new pollution report.

**Request Body:**

```json
{
  "locationName": "Bhubaneswar Railway Station",
  "description": "vehicular: Heavy diesel emissions from buses",
  "timestamp": "2026-01-01T12:00:00Z"
}
```

## 🎨 Design Features

- **Dark Theme**: Professional environmental monitoring aesthetic
- **Color-Coded AQI**: Immediate visual feedback on air quality
- **Responsive Grid**: Adapts to all screen sizes
- **Interactive Elements**: Hover states, animations, and transitions
- **Accessible**: WCAG-compliant contrast ratios and keyboard navigation

## 📊 Data Model

### Hotspot Schema

```typescript
{
  name: String,
  lat: Number,
  lng: Number,
  intensity: Number,
  aqi: Number,
  type: 'fire' | 'industrial' | 'vehicular' | 'natural' | 'other',
  source: String,
  recommendation: String
}
```

### Report Schema

```typescript
{
  locationName: String,
  description: String,
  timestamp: Date
}
```

## 🔄 Development Workflow

This project was built using modular development sprints:

1. **Part 1**: Foundation (Next.js + MongoDB setup)
2. **Part 2**: API Routes & Data Seeding
3. **Part 3**: Interactive Mapping with Leaflet
4. **Part 4**: Dashboard UI with Shadcn
5. **Part 5**: Community Reporting & Final Polish

## 🌟 Future Enhancements

- [ ] Real-time data updates with WebSockets
- [ ] Historical AQI trends and charts
- [ ] User authentication and report verification
- [ ] Mobile app (React Native)
- [ ] AI-powered pollution prediction
- [ ] Multi-city support
- [ ] Export data as CSV/PDF reports
- [ ] Integration with government air quality APIs

## 📝 License

This project is built for educational and demonstration purposes.

## 👥 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## 📧 Contact

For questions or feedback about this environmental monitoring tool, please open an issue in the repository.

---

**Built with ❤️ for cleaner air in Bhubaneswar**

// Test data seeding script for PollutionX
// Use this data with Postman or other API testing tools

// Hotspot data
const sampleHotspots = [
  {
    name: "Bhubaneswar Railway Station Area",
    lat: 20.2538,
    lng: 85.8410,
    intensity: 110.5,
    aqi: 165,
    type: "vehicular",
    source: "High vehicle density and diesel emissions from trains and buses",
    recommendation: "Improve traffic flow, increase green cover, and implement emission monitoring systems"
  },
  {
    name: "Mancheswar Industrial Area",
    lat: 20.2350,
    lng: 85.7780,
    intensity: 145.8,
    aqi: 195,
    type: "industrial",
    source: "Manufacturing units, thermal power plant emissions, and industrial waste",
    recommendation: "Enforce stricter emission standards, install pollution control devices, and regular monitoring"
  },
  {
    name: "Patia IT Hub",
    lat: 20.3500,
    lng: 85.8200,
    intensity: 85.2,
    aqi: 125,
    type: "vehicular",
    source: "Heavy IT park traffic, construction activities, and vehicle emissions",
    recommendation: "Promote carpooling, improve public transport connectivity, and complete ongoing construction"
  },
  {
    name: "Kalpana Square Traffic Junction",
    lat: 20.2963,
    lng: 85.8245,
    intensity: 125.3,
    aqi: 180,
    type: "vehicular",
    source: "Major traffic intersection with continuous vehicle flow and poor ventilation",
    recommendation: "Install traffic management systems, create flyovers, and add air quality monitors"
  },
  {
    name: "Rasulgarh Industrial Estate",
    lat: 20.2800,
    lng: 85.7950,
    intensity: 135.7,
    aqi: 188,
    type: "industrial",
    source: "Small and medium industries, metal processing units, and chemical manufacturing",
    recommendation: "Regular emission audits, waste treatment facilities, and green buffer zones"
  }
];

// Report data
const sampleReports = [
  {
    locationName: "Master Canteen Square",
    description: "Dense vehicle exhaust fumes during morning and evening peak hours causing visibility issues and respiratory discomfort",
    timestamp: new Date('2024-01-15T08:30:00.000Z')
  },
  {
    locationName: "Saheed Nagar Main Road",
    description: "Excessive road dust and construction particles from nearby building projects affecting residential areas",
    timestamp: new Date('2024-01-15T11:15:00.000Z')
  },
  {
    locationName: "Unit 1 Market Complex",
    description: "Strong plastic burning smell detected near market area, possible illegal waste disposal by vendors",
    timestamp: new Date('2024-01-15T17:20:00.000Z')
  },
  {
    locationName: "Jaydev Vihar Residential Area",
    description: "Unusual chemical odor from nearby industrial area affecting residents, especially children and elderly",
    timestamp: new Date('2024-01-15T19:45:00.000Z')
  },
  {
    locationName: "Khandagiri Square",
    description: "Road construction and heavy vehicle movement creating dust storms and air pollution",
    timestamp: new Date('2024-01-16T09:20:00.000Z')
  },
  {
    locationName: "Nayapalli Market Area",
    description: "Waste burning near market producing toxic fumes, vendors burning plastic and organic waste",
    timestamp: new Date('2024-01-16T16:45:00.000Z')
  }
];

console.log('📊 Sample Hotspots Data:');
console.log(JSON.stringify(sampleHotspots, null, 2));

console.log('\n📋 Sample Reports Data:');
console.log(JSON.stringify(sampleReports, null, 2));

console.log('\n🚀 Ready to use with your API endpoints!');
console.log('Hotspots: POST to http://localhost:3001/api/hotspots');
console.log('Reports: POST to http://localhost:3001/api/reports');

module.exports = {
  sampleHotspots,
  sampleReports
};

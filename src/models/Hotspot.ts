import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IHotspot extends Document {
  name: string;
  lat: number;
  lng: number;
  intensity: number;
  aqi: number;
  type: string;
  source: string;
  recommendation: string;
  createdAt: Date;
  updatedAt: Date;
}

const HotspotSchema: Schema<IHotspot> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    lat: {
      type: Number,
      required: [true, 'Latitude is required'],
      min: [-90, 'Latitude must be between -90 and 90'],
      max: [90, 'Latitude must be between -90 and 90'],
    },
    lng: {
      type: Number,
      required: [true, 'Longitude is required'],
      min: [-180, 'Longitude must be between -180 and 180'],
      max: [180, 'Longitude must be between -180 and 180'],
    },
    intensity: {
      type: Number,
      required: [true, 'Intensity is required'],
      min: [0, 'Intensity must be a positive number'],
    },
    aqi: {
      type: Number,
      required: [true, 'AQI is required'],
      min: [0, 'AQI must be a positive number'],
      max: [500, 'AQI must be between 0 and 500'],
    },
    type: {
      type: String,
      required: [true, 'Type is required'],
      trim: true,
      enum: {
        values: ['fire', 'industrial', 'vehicular', 'natural', 'other'],
        message: '{VALUE} is not a valid pollution type',
      },
    },
    source: {
      type: String,
      required: [true, 'Source is required'],
      trim: true,
    },
    recommendation: {
      type: String,
      required: [true, 'Recommendation is required'],
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create indexes for better query performance
HotspotSchema.index({ lat: 1, lng: 1 }); // Geospatial queries
HotspotSchema.index({ type: 1 }); // Filter by pollution type
HotspotSchema.index({ aqi: 1 }); // Sort by AQI
HotspotSchema.index({ createdAt: -1 }); // Sort by creation date

// Export the model, avoiding re-compilation in development
const Hotspot: Model<IHotspot> = 
  mongoose.models.Hotspot || mongoose.model<IHotspot>('Hotspot', HotspotSchema);

export default Hotspot;

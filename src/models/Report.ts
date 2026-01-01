import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IReport extends Document {
  locationName: string;
  description: string;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema: Schema<IReport> = new Schema(
  {
    locationName: {
      type: String,
      required: [true, 'Location name is required'],
      trim: true,
      maxlength: [200, 'Location name cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    timestamp: {
      type: Date,
      required: [true, 'Timestamp is required'],
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create indexes for better query performance
ReportSchema.index({ locationName: 1 }); // Search by location
ReportSchema.index({ timestamp: -1 }); // Sort by timestamp
ReportSchema.index({ createdAt: -1 }); // Sort by creation date
ReportSchema.index({ locationName: 'text', description: 'text' }); // Text search

// Export the model, avoiding re-compilation in development
const Report: Model<IReport> = 
  mongoose.models.Report || mongoose.model<IReport>('Report', ReportSchema);

export default Report;

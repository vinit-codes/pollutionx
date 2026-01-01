import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Report from '@/models/Report';

interface MongooseValidationError extends Error {
  errors: Record<string, { message: string }>;
}

interface ReportFilter {
  locationName?: string | { $regex: string; $options: string };
  timestamp?: {
    $gte?: Date;
    $lte?: Date;
  };
  $text?: { $search: string };
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Get query parameters for filtering and pagination
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const location = searchParams.get('location');
    const search = searchParams.get('search');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    // Build filter object
    const filter: ReportFilter = {};
    
    // Location filter (partial match)
    if (location) {
      filter.locationName = { $regex: location, $options: 'i' };
    }
    
    // Text search across location and description
    if (search) {
      filter.$text = { $search: search };
    }
    
    // Date range filter
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }
    
    // Execute query with pagination
    const skip = (page - 1) * limit;
    let query = Report.find(filter)
      .sort({ timestamp: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    // Add text search score if searching
    if (search) {
      query = query.select({ score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } });
    }
    
    const reports = await query;
    
    // Get total count for pagination
    const total = await Report.countDocuments(filter);
    
    return NextResponse.json({
      success: true,
      data: reports,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: reports.length,
        totalRecords: total,
      },
    });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch reports',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    
    // Handle both single report and array of reports
    const isArray = Array.isArray(body);
    
    if (isArray) {
      // Bulk insert for arrays
      const result = await Report.insertMany(body);
      
      return NextResponse.json({
        success: true,
        data: result,
        count: result.length,
        message: `Successfully created ${result.length} reports`,
      }, { status: 201 });
    } else {
      // Single report creation
      const result = await Report.create(body);
      
      return NextResponse.json({
        success: true,
        data: result,
        count: 1,
        message: 'Successfully created report',
      }, { status: 201 });
    }
    
  } catch (error) {
    console.error('Database Error:', error);
    
    // Handle validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
      const validationError = error as MongooseValidationError;
      const errors = Object.values(validationError.errors).map((err) => err.message);
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: errors,
        },
        { status: 400 }
      );
    }
    
    // Handle bulk write errors
    if (error instanceof Error && 'writeErrors' in error) {
      return NextResponse.json(
        {
          success: false,
          error: 'Bulk insert failed',
          details: 'Some records could not be inserted due to validation or duplicate key errors',
        },
        { status: 400 }
      );
    }
    
    // Handle invalid date errors
    if (error instanceof Error && error.message.includes('Cast to date failed')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid date format',
          details: 'Please provide timestamp in valid ISO date format',
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create report(s)',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

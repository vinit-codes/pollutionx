import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Hotspot from '@/models/Hotspot';

interface MongooseValidationError extends Error {
  errors: Record<string, { message: string }>;
}

interface HotspotFilter {
  type?: string;
  aqi?: {
    $gte?: number;
    $lte?: number;
  };
}

interface HotspotFilter {
  type?: string;
  aqi?: {
    $gte?: number;
    $lte?: number;
  };
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Get query parameters for filtering and pagination
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const type = searchParams.get('type');
    const minAqi = searchParams.get('minAqi');
    const maxAqi = searchParams.get('maxAqi');
    
    // Build filter object
    const filter: HotspotFilter = {};
    if (type) filter.type = type;
    if (minAqi || maxAqi) {
      filter.aqi = {};
      if (minAqi) filter.aqi.$gte = parseInt(minAqi);
      if (maxAqi) filter.aqi.$lte = parseInt(maxAqi);
    }
    
    // Execute query with pagination
    const skip = (page - 1) * limit;
    const hotspots = await Hotspot.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(); // Use lean() for better performance
    
    // Get total count for pagination
    const total = await Hotspot.countDocuments(filter);
    
    return NextResponse.json({
      success: true,
      data: hotspots,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: hotspots.length,
        totalRecords: total,
      },
    });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch hotspots',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    
    // Handle both single hotspot and array of hotspots
    const isArray = Array.isArray(body);
    
    if (isArray) {
      // Bulk insert for arrays
      const result = await Hotspot.insertMany(body);
      
      return NextResponse.json({
        success: true,
        data: result,
        count: result.length,
        message: `Successfully created ${result.length} hotspots`,
      }, { status: 201 });
    } else {
      // Single hotspot creation
      const result = await Hotspot.create(body);
      
      return NextResponse.json({
        success: true,
        data: result,
        count: 1,
        message: 'Successfully created hotspot',
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
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create hotspot(s)',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

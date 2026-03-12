import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const rainfallData = await prisma.rainfallData.findMany({
      orderBy: { measuredAt: 'desc' },
      take: 100, // Limit to 100 most recent entries for public access
    });

    return NextResponse.json(rainfallData);
  } catch (error) {
    console.error('Error fetching rainfall data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      {
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}
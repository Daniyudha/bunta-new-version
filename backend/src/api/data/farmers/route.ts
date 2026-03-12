import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const farmers = await prisma.farmer.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100, // Limit to 100 most recent entries for public access
      select: {
        id: true,
        name: true,
        group: true,
        chairman: true,
        members: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Convert members JSON to array for each farmer with robust error handling
    const farmersWithParsedMembers = farmers.map(farmer => {
      try {
        const membersData = farmer.members;
        if (Array.isArray(membersData)) {
          return { ...farmer, members: membersData };
        }
        if (typeof membersData === 'string') {
          const parsed = JSON.parse(membersData);
          return { ...farmer, members: Array.isArray(parsed) ? parsed : [] };
        }
        return { ...farmer, members: [] };
      } catch (parseError) {
        return { ...farmer, members: [] };
      }
    });

    return NextResponse.json(farmersWithParsedMembers);
  } catch (error) {
    console.error('Error fetching farmer data:', error);
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
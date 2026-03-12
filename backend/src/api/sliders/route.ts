import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const sliders = await prisma.slider.findMany({
      where: {
        active: true,
      },
      orderBy: {
        order: 'asc',
      },
    });

    return NextResponse.json(sliders);
  } catch (error) {
    console.error('Error fetching sliders:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
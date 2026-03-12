import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    // Build where clause for filtering
    const where: { active: boolean; category?: string } = { active: true };

    if (category && category !== 'All') {
      where.category = category;
    }

    const gallery = await prisma.gallery.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(gallery);
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
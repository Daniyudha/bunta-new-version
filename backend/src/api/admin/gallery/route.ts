import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const skip = (page - 1) * limit;

    // Build where clause for search and category
    let where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { category: { contains: search } },
      ];
    }

    if (category && category !== 'All') {
      // If we already have where conditions (from search), use AND to combine
      if (Object.keys(where).length > 0) {
        where = {
          AND: [
            where,
            { category }
          ]
        };
      } else {
        where.category = category;
      }
    }

    console.log('Search query:', search);
    console.log('Category filter:', category);
    console.log('Where clause:', JSON.stringify(where, null, 2));

    const [gallery, total] = await Promise.all([
      prisma.gallery.findMany({
        skip,
        take: limit,
        where,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.gallery.count({ where }),
    ]);

    return NextResponse.json({
      data: gallery,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching gallery:', error);
    // Log detailed error information
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json(
      { message: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, imageUrl, category, type, active } = body;

    // Validate required fields
    if (!title || !imageUrl || !category) {
      return NextResponse.json(
        { message: 'Title, imageUrl, and category are required' },
        { status: 400 }
      );
    }

    const gallery = await prisma.gallery.create({
      data: {
        title,
        description: description || '',
        imageUrl,
        category,
        type: type || 'image',
        active: active ?? true,
      },
    });

    return NextResponse.json(gallery, { status: 201 });
  } catch (error) {
    console.error('Error creating gallery item:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
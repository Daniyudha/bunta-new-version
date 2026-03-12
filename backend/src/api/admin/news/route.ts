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
    const skip = (page - 1) * limit;

    // Build where clause for search
    // Use simple contains instead of case-insensitive mode for better compatibility
    const where = search ? {
      OR: [
        { title: { contains: search } },
        { slug: { contains: search } },
        { content: { contains: search } },
      ],
    } : {};

    console.log('Search query:', search);
    console.log('Where clause:', JSON.stringify(where, null, 2));
    
    let news, total;
    try {
      [news, total] = await Promise.all([
        prisma.news.findMany({
          skip,
          take: limit,
          where,
          orderBy: { createdAt: 'desc' },
          include: {
            category: {
              select: {
                name: true,
              },
            },
          },
        }),
        prisma.news.count({ where }),
      ]);
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        {
          message: 'Database query failed',
          details: dbError instanceof Error ? dbError.message : 'Unknown database error'
        },
        { status: 500 }
      );
    }
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      news,
      totalPages,
      totalCount: total,
      currentPage: page,
      hasNext: page < totalPages,
      hasPrev: page > 1
    });
  } catch (error) {
    console.error('Error fetching news:', error);
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

    if (!session || !session.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, slug, content, excerpt, image, categoryId, published } = body;

    // Validate required fields
    if (!title || !slug || !content) {
      return NextResponse.json(
        { message: 'Title, slug, and content are required' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingNews = await prisma.news.findUnique({
      where: { slug },
    });

    if (existingNews) {
      return NextResponse.json(
        { message: 'News with this slug already exists' },
        { status: 400 }
      );
    }

    // Get user ID from session
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const news = await prisma.news.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        image,
        categoryId: categoryId || null,
        authorId: user.id,
        published: published || false,
        publishedAt: published ? new Date() : null,
      },
    });

    return NextResponse.json(news, { status: 201 });
  } catch (error) {
    console.error('Error creating news:', error);
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
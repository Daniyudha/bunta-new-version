import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface QueryParams {
  page?: string;
  limit?: string;
  category?: string;
  search?: string;
}

// Define proper TypeScript interfaces for the where clause
interface WhereClause {
  published: boolean;
  category?: {
    name: string;
  };
  OR?: Array<{
    title?: {
      contains: string;
    };
    excerpt?: {
      contains: string;
    };
    content?: {
      contains: string;
    };
  }>;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '6');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    // Build where clause for filtering with proper TypeScript types
    const where: WhereClause = {
      published: true,
    };

    if (category && category !== 'All') {
      where.category = {
        name: category,
      };
    }

    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
            // mode: 'insensitive', // Remove mode for MySQL compatibility
          },
        },
        {
          excerpt: {
            contains: search,
            // mode: 'insensitive',
          },
        },
        {
          content: {
            contains: search,
            // mode: 'insensitive',
          },
        },
      ];
    }

    const [news, total] = await Promise.all([
      prisma.news.findMany({
        where,
        include: {
          category: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.news.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      news,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { message: 'Error fetching news' },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { unlink } from 'fs/promises';
import { join } from 'path';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const news = await prisma.news.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!news) {
      return NextResponse.json({ message: 'News not found' }, { status: 404 });
    }

    return NextResponse.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, slug, content, excerpt, image, categoryId, published } = body;

    // Check if news exists
    const existingNews = await prisma.news.findUnique({
      where: { id },
    });

    if (!existingNews) {
      return NextResponse.json({ message: 'News not found' }, { status: 404 });
    }

    // Check if slug is being changed and if it already exists
    if (slug && slug !== existingNews.slug) {
      const slugExists = await prisma.news.findUnique({
        where: { slug },
      });

      if (slugExists) {
        return NextResponse.json(
          { message: 'News with this slug already exists' },
          { status: 400 }
        );
      }
    }

    const updatedNews = await prisma.news.update({
      where: { id },
      data: {
        title: title ?? existingNews.title,
        slug: slug ?? existingNews.slug,
        content: content ?? existingNews.content,
        excerpt: excerpt ?? existingNews.excerpt,
        image: image ?? existingNews.image,
        categoryId: categoryId ?? existingNews.categoryId,
        published: published ?? existingNews.published,
        publishedAt: published ? new Date() : existingNews.publishedAt,
      },
    });

    return NextResponse.json(updatedNews);
  } catch (error) {
    console.error('Error updating news:', error);
    // Log detailed error information
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json(
      {
        message: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Check if news exists
    const existingNews = await prisma.news.findUnique({
      where: { id },
    });

    if (!existingNews) {
      return NextResponse.json({ message: 'News not found' }, { status: 404 });
    }

    // Delete associated file if it exists
    if (existingNews.image && existingNews.image.startsWith('/uploads/news/')) {
      try {
        const filename = existingNews.image.split('/').pop();
        if (filename) {
          const filePath = join(process.cwd(), 'public', 'uploads', 'news', filename);
          await unlink(filePath);
          console.log('Deleted file:', filePath);
        }
      } catch (fileError) {
        console.error('Error deleting file:', fileError);
        // Continue with database deletion even if file deletion fails
      }
    }

    await prisma.news.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'News deleted successfully' });
  } catch (error) {
    console.error('Error deleting news:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
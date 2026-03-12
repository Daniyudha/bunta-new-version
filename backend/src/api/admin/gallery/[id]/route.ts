import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { unlink } from 'fs/promises';
import { join } from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const galleryItem = await prisma.gallery.findUnique({
      where: { id },
    });

    if (!galleryItem) {
      return NextResponse.json({ message: 'Gallery item not found' }, { status: 404 });
    }

    return NextResponse.json(galleryItem);
  } catch (error) {
    console.error('Error fetching gallery item:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, imageUrl, category, type, active } = body;

    // Check if gallery item exists
    const existingItem = await prisma.gallery.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return NextResponse.json({ message: 'Gallery item not found' }, { status: 404 });
    }

    const updatedItem = await prisma.gallery.update({
      where: { id },
      data: {
        title: title ?? existingItem.title,
        description: description ?? existingItem.description,
        imageUrl: imageUrl ?? existingItem.imageUrl,
        category: category ?? existingItem.category,
        type: type ?? existingItem.type,
        active: active ?? existingItem.active,
      },
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Error updating gallery item:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Check if gallery item exists
    const existingItem = await prisma.gallery.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return NextResponse.json({ message: 'Gallery item not found' }, { status: 404 });
    }

    // Delete associated file if it exists
    if (existingItem.imageUrl && existingItem.imageUrl.startsWith('/uploads/gallery/')) {
      try {
        const filename = existingItem.imageUrl.split('/').pop();
        if (filename) {
          const filePath = join(process.cwd(), 'public', 'uploads', 'gallery', filename);
          await unlink(filePath);
          console.log('Deleted file:', filePath);
        }
      } catch (fileError) {
        console.error('Error deleting file:', fileError);
        // Continue with database deletion even if file deletion fails
      }
    }

    await prisma.gallery.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
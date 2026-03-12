import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { unlink } from 'fs/promises';
import { join } from 'path';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Only allow users with ADMIN or SUPER_ADMIN roles to access sliders
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email || '' },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });

    if (!user || !user.role || (user.role.name !== 'ADMIN' && user.role.name !== 'SUPER_ADMIN')) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { id } = await context.params;

    const slider = await prisma.slider.findUnique({
      where: { id },
    });

    if (!slider) {
      return NextResponse.json({ message: 'Slider not found' }, { status: 404 });
    }

    return NextResponse.json(slider);
  } catch (error) {
    console.error('Error fetching slider:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Only allow users with ADMIN or SUPER_ADMIN roles to update sliders
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email || '' },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });

    if (!user || !user.role || (user.role.name !== 'ADMIN' && user.role.name !== 'SUPER_ADMIN')) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { id } = await context.params;
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      // Handle file upload for update
      const formData = await request.formData();
      const title = formData.get('title') as string;
      const subtitle = formData.get('subtitle') as string;
      const link = formData.get('link') as string;
      const buttonText = formData.get('buttonText') as string;
      const order = parseInt(formData.get('order') as string) || 0;
      const active = formData.get('active') === 'true';
      const file = formData.get('image') as File;

      // Validate required fields
      if (!title) {
        return NextResponse.json(
          { message: 'Title is required' },
          { status: 400 }
        );
      }

      let imageUrl: string | undefined;

      // If a new file is provided, upload it
      if (file && file.size > 0) {
        // Check file size limit (10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB in bytes
        if (file.size > maxSize) {
          return NextResponse.json(
            { message: 'File size too large. Maximum allowed size is 10MB.' },
            { status: 400 }
          );
        }

        const uploadFormData = new FormData();
        uploadFormData.append('file', file);

        const uploadResponse = await fetch(`${request.nextUrl.origin}/api/admin/sliders/upload`, {
          method: 'POST',
          body: uploadFormData,
          headers: {
            'cookie': request.headers.get('cookie') || '',
          },
        });

        if (!uploadResponse.ok) {
          const error = await uploadResponse.json();
          return NextResponse.json(
            { message: error.error || 'Failed to upload image' },
            { status: uploadResponse.status }
          );
        }

        const uploadResult = await uploadResponse.json();
        imageUrl = uploadResult.url;
      }

      // Update slider with new data
      const updateData: {
        title: string;
        subtitle: string | null;
        link: string | null;
        buttonText: string;
        order: number;
        active: boolean;
        image?: string;
      } = {
        title,
        subtitle: subtitle || null,
        link: link || null,
        buttonText: buttonText || 'Pelajari Lebih Lanjut',
        order,
        active,
      };

      if (imageUrl) {
        updateData.image = imageUrl;
      }

      const slider = await prisma.slider.update({
        where: { id },
        data: updateData,
      });

      return NextResponse.json(slider);
    } else {
      // Handle JSON request for backward compatibility
      const body = await request.json();
      const { title, subtitle, image, link, buttonText, order, active } = body;

      // Validate required fields
      if (!title || !image) {
        return NextResponse.json(
          { message: 'Title and image are required' },
          { status: 400 }
        );
      }

      const slider = await prisma.slider.update({
        where: { id },
        data: {
          title,
          subtitle: subtitle || null,
          image,
          link: link || null,
          buttonText: buttonText || 'Pelajari Lebih Lanjut',
          order: order || 0,
          active: active !== undefined ? active : true,
        },
      });

      return NextResponse.json(slider);
    }

  } catch (error) {
    console.error('Error updating slider:', error);
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json({ message: 'Slider not found' }, { status: 404 });
    }
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Only allow users with ADMIN or SUPER_ADMIN roles to delete sliders
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email || '' },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });

    if (!user || !user.role || (user.role.name !== 'ADMIN' && user.role.name !== 'SUPER_ADMIN')) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { id } = await context.params;

    // Check if slider exists and get image URL
    const existingSlider = await prisma.slider.findUnique({
      where: { id },
    });

    if (!existingSlider) {
      return NextResponse.json({ message: 'Slider not found' }, { status: 404 });
    }

    // Delete associated file if it exists
    if (existingSlider.image && existingSlider.image.startsWith('/uploads/sliders/')) {
      try {
        const filename = existingSlider.image.split('/').pop();
        if (filename) {
          const filePath = join(process.cwd(), 'public', 'uploads', 'sliders', filename);
          await unlink(filePath);
          console.log('Deleted file:', filePath);
        }
      } catch (fileError) {
        console.error('Error deleting file:', fileError);
        // Continue with database deletion even if file deletion fails
      }
    }

    await prisma.slider.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Slider deleted successfully' });
  } catch (error) {
    console.error('Error deleting slider:', error);
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return NextResponse.json({ message: 'Slider not found' }, { status: 404 });
    }
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
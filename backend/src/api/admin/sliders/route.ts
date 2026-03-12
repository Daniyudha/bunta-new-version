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

    const sliders = await prisma.slider.findMany({
      orderBy: { order: 'asc' },
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

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Only allow users with ADMIN or SUPER_ADMIN roles to create sliders
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

    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      // Handle file upload
      const formData = await request.formData();
      const title = formData.get('title') as string;
      const subtitle = formData.get('subtitle') as string;
      const link = formData.get('link') as string;
      const buttonText = formData.get('buttonText') as string;
      const order = parseInt(formData.get('order') as string) || 0;
      const active = formData.get('active') === 'true';
      const file = formData.get('image') as File;

      // Validate required fields
      if (!title || !file) {
        return NextResponse.json(
          { message: 'Title and image are required' },
          { status: 400 }
        );
      }

      // Check file size limit (10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        return NextResponse.json(
          { message: 'File size too large. Maximum allowed size is 10MB.' },
          { status: 400 }
        );
      }

      // Upload file to slider upload endpoint
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
      const imageUrl = uploadResult.url;

      const slider = await prisma.slider.create({
        data: {
          title,
          subtitle: subtitle || null,
          image: imageUrl,
          link: link || null,
          buttonText: buttonText || 'Pelajari Lebih Lanjut',
          order,
          active,
        },
      });

      return NextResponse.json(slider, { status: 201 });
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

      const slider = await prisma.slider.create({
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

      return NextResponse.json(slider, { status: 201 });
    }

  } catch (error) {
    console.error('Error creating slider:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
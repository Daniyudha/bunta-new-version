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

    // Only allow users with ADMIN or SUPER_ADMIN roles to access crop data
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

    const cropData = await prisma.cropData.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(cropData);
  } catch (error) {
    console.error('Error fetching crop data:', error);
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

    // Only allow users with ADMIN or SUPER_ADMIN roles to create crop data
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

    const body = await request.json();
    const { crop, area, production, season, location } = body;

    // Validate required fields
    if (!crop || area === undefined || production === undefined || !season) {
      return NextResponse.json(
        { message: 'Crop, area, production, and season are required' },
        { status: 400 }
      );
    }

    const cropData = await prisma.cropData.create({
      data: {
        crop,
        area: parseFloat(area),
        production: parseFloat(production),
        season,
        location: location || null,
        recordedBy: user.id,
      },
    });

    return NextResponse.json(cropData, { status: 201 });
  } catch (error) {
    console.error('Error creating crop data:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Only allow users with ADMIN or SUPER_ADMIN roles to update crop data
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

    const body = await request.json();
    const { id, crop, area, production, season, location } = body;

    // Validate required fields
    if (!id || !crop || area === undefined || production === undefined || !season) {
      return NextResponse.json(
        { message: 'ID, crop, area, production, and season are required' },
        { status: 400 }
      );
    }

    const updatedData = await prisma.cropData.update({
      where: { id },
      data: {
        crop,
        area: parseFloat(area),
        production: parseFloat(production),
        season,
        location: location || null,
      },
    });

    return NextResponse.json(updatedData);
  } catch (error) {
    console.error('Error updating crop data:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Only allow users with ADMIN or SUPER_ADMIN roles to delete crop data
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

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { message: 'ID parameter is required' },
        { status: 400 }
      );
    }

    await prisma.cropData.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Data deleted successfully' });
  } catch (error) {
    console.error('Error deleting crop data:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
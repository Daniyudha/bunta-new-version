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

    // Only allow users with ADMIN or SUPER_ADMIN roles to access water level data
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

    const waterLevelData = await prisma.waterLevelData.findMany({
      orderBy: { measuredAt: 'desc' },
    });

    return NextResponse.json(waterLevelData);
  } catch (error) {
    console.error('Error fetching water level data:', error);
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

    // Only allow users with ADMIN or SUPER_ADMIN roles to create water level data
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
    const { location, value, unit, measuredAt } = body;

    // Validate required fields
    if (!location || value === undefined || !measuredAt) {
      return NextResponse.json(
        { message: 'Location, value, and measuredAt are required' },
        { status: 400 }
      );
    }

    const waterLevelData = await prisma.waterLevelData.create({
      data: {
        location,
        value: parseFloat(value),
        unit: unit || 'cm',
        measuredAt: new Date(measuredAt),
        recordedBy: user.id,
      },
    });

    return NextResponse.json(waterLevelData, { status: 201 });
  } catch (error) {
    console.error('Error creating water level data:', error);
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

    // Only allow users with ADMIN or SUPER_ADMIN roles to update water level data
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
    const { id, location, value, unit, measuredAt } = body;

    // Validate required fields
    if (!id || !location || value === undefined || !measuredAt) {
      return NextResponse.json(
        { message: 'ID, location, value, and measuredAt are required' },
        { status: 400 }
      );
    }

    const updatedData = await prisma.waterLevelData.update({
      where: { id },
      data: {
        location,
        value: parseFloat(value),
        unit: unit || 'cm',
        measuredAt: new Date(measuredAt),
      },
    });

    return NextResponse.json(updatedData);
  } catch (error) {
    console.error('Error updating water level data:', error);
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

    // Only allow users with ADMIN or SUPER_ADMIN roles to delete water level data
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

    await prisma.waterLevelData.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Data deleted successfully' });
  } catch (error) {
    console.error('Error deleting water level data:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
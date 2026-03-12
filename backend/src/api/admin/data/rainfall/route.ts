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

    // Only allow users with ADMIN or SUPER_ADMIN roles to access rainfall data
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

    const rainfallData = await prisma.rainfallData.findMany({
      orderBy: { measuredAt: 'desc' },
    });

    return NextResponse.json(rainfallData);
  } catch (error) {
    console.error('Error fetching rainfall data:', error);
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

    // Only allow users with ADMIN or SUPER_ADMIN roles to create rainfall data
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

    const rainfallData = await prisma.rainfallData.create({
      data: {
        location,
        value: parseFloat(value),
        unit: unit || 'mm',
        measuredAt: new Date(measuredAt),
        recordedBy: user.id,
      },
    });

    return NextResponse.json(rainfallData, { status: 201 });
  } catch (error) {
    console.error('Error creating rainfall data:', error);
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

    // Only allow users with ADMIN or SUPER_ADMIN roles to update rainfall data
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

    const updatedData = await prisma.rainfallData.update({
      where: { id },
      data: {
        location,
        value: parseFloat(value),
        unit: unit || 'mm',
        measuredAt: new Date(measuredAt),
      },
    });

    return NextResponse.json(updatedData);
  } catch (error) {
    console.error('Error updating rainfall data:', error);
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

    // Check user permissions for data deletion
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email || '' },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    if (!user || !user.role) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Check if user has data delete permission or is SUPER_ADMIN
    const hasDataDeletePermission = user.role.permissions.some(
      (rolePermission) => rolePermission.permission.name === 'data:delete'
    );
    const isSuperAdmin = user.role.name === 'SUPER_ADMIN';

    if (!hasDataDeletePermission && !isSuperAdmin) {
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

    await prisma.rainfallData.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Data deleted successfully' });
  } catch (error) {
    console.error('Error deleting rainfall data:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
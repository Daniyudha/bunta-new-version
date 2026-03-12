import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Only allow ADMIN or SUPER_ADMIN to access rainfall data
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email || '' },
      include: { role: true },
    });

    if (!user || !user.role || (user.role.name !== 'ADMIN' && user.role.name !== 'SUPER_ADMIN')) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const rainfallData = await prisma.rainfallData.findUnique({
      where: { id },
    });

    if (!rainfallData) {
      return NextResponse.json({ message: 'Rainfall data not found' }, { status: 404 });
    }

    return NextResponse.json(rainfallData);
  } catch (error) {
    console.error('Error fetching rainfall data:', error);
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
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Only allow ADMIN or SUPER_ADMIN to update rainfall data
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email || '' },
      include: { role: true },
    });

    if (!user || !user.role || (user.role.name !== 'ADMIN' && user.role.name !== 'SUPER_ADMIN')) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { location, value, unit, measuredAt } = body;

    // Check if data exists
    const existingData = await prisma.rainfallData.findUnique({
      where: { id },
    });

    if (!existingData) {
      return NextResponse.json({ message: 'Rainfall data not found' }, { status: 404 });
    }

    const updatedData = await prisma.rainfallData.update({
      where: { id },
      data: {
        location: location ?? existingData.location,
        value: value !== undefined ? parseFloat(value) : existingData.value,
        unit: unit ?? existingData.unit,
        measuredAt: measuredAt ? new Date(measuredAt) : existingData.measuredAt,
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Only allow ADMIN or SUPER_ADMIN to delete rainfall data
    const user = await prisma.user.findUnique({
      where: { email: session.user?.email || '' },
      include: { role: true },
    });

    if (!user || !user.role || (user.role.name !== 'ADMIN' && user.role.name !== 'SUPER_ADMIN')) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Check if data exists
    const existingData = await prisma.rainfallData.findUnique({
      where: { id },
    });

    if (!existingData) {
      return NextResponse.json({ message: 'Rainfall data not found' }, { status: 404 });
    }

    await prisma.rainfallData.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Rainfall data deleted successfully' });
  } catch (error) {
    console.error('Error deleting rainfall data:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
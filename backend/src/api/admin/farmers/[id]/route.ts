import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UpdateFarmerInput } from '@/types/farmer';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const farmer = await prisma.farmer.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!farmer) {
      return NextResponse.json(
        { message: 'Farmer not found' },
        { status: 404 }
      );
    }

    // Convert members JSON to array for response
    const farmerResponse = {
      ...farmer,
      members: Array.isArray(farmer.members) ? farmer.members : JSON.parse(farmer.members as string),
    };

    return NextResponse.json(farmerResponse);
  } catch (error) {
    console.error('Error fetching farmer:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body: UpdateFarmerInput = await request.json();
    const { name, group, chairman, members, userId } = body;

    // Check if farmer exists
    const existingFarmer = await prisma.farmer.findUnique({
      where: { id },
    });

    if (!existingFarmer) {
      return NextResponse.json(
        { message: 'Farmer not found' },
        { status: 404 }
      );
    }

    const updatedFarmer = await prisma.farmer.update({
      where: { id },
      data: {
        name,
        group,
        chairman,
        members: members, // Stored as JSON
        userId: userId || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Convert members JSON to array for response
    const farmerResponse = {
      ...updatedFarmer,
      members: Array.isArray(updatedFarmer.members) ? updatedFarmer.members : JSON.parse(updatedFarmer.members as string),
    };

    return NextResponse.json(farmerResponse);
  } catch (error) {
    console.error('Error updating farmer:', error);
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
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Check if farmer exists
    const existingFarmer = await prisma.farmer.findUnique({
      where: { id },
    });

    if (!existingFarmer) {
      return NextResponse.json(
        { message: 'Farmer not found' },
        { status: 404 }
      );
    }

    await prisma.farmer.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Farmer deleted successfully' });
  } catch (error) {
    console.error('Error deleting farmer:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
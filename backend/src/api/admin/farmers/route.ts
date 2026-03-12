import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { CreateFarmerInput } from '@/types/farmer';

// Helper function to check database connection
async function checkDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Farmers API GET request received');

    // Check database connection first
    const dbConnected = await checkDatabaseConnection();
    if (!dbConnected) {
      console.error('❌ Database connection failed');
      return NextResponse.json(
        { message: 'Database connection error' },
        { status: 500 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session) {
      console.log('❌ No session found - returning 401');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    console.log('✅ Session found for user:', session.user?.email);

    // Check user role and permissions with better error handling
    let user;
    try {
      user = await prisma.user.findUnique({
        where: { email: session.user?.email || '' },
        include: {
          role: {
            include: {
              permissions: true,
            },
          },
        },
      });
    } catch (userError) {
      console.error('❌ Error fetching user from database:', userError);
      return NextResponse.json(
        { message: 'Failed to authenticate user' },
        { status: 500 }
      );
    }

    if (!user) {
      console.log('❌ User not found in database');
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    if (!user.role) {
      console.log('❌ User has no role assigned');
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    if (user.role.name !== 'ADMIN' && user.role.name !== 'SUPER_ADMIN') {
      console.log('❌ User role not authorized:', user.role.name);
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    console.log('✅ User authorized with role:', user.role.name);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const skip = (page - 1) * limit;

    // Build where clause for search (MySQL compatible)
    const where = search ? {
      OR: [
        { name: { contains: search } },
        { group: { contains: search } },
        { chairman: { contains: search } },
      ],
    } : {};

    console.log('📋 Fetching farmers with params:', { page, limit, skip, search });

    let farmers, total;
    try {
      [farmers, total] = await Promise.all([
        prisma.farmer.findMany({
          skip,
          take: limit,
          where,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        }),
        prisma.farmer.count({ where }),
      ]);
    } catch (dbError) {
      console.error('❌ Database query error:', dbError);
      return NextResponse.json(
        { message: 'Failed to fetch farmers data' },
        { status: 500 }
      );
    }

    console.log(`✅ Found ${farmers.length} farmers out of ${total} total`);

    // Convert members JSON to array for each farmer with robust error handling
    const farmersWithParsedMembers = farmers.map(farmer => {
      try {
        const membersData = farmer.members;
        
        // Handle case where members might already be parsed or null
        if (Array.isArray(membersData)) {
          return { ...farmer, members: membersData };
        }
        
        if (typeof membersData === 'string') {
          // Handle empty string or invalid JSON
          if (membersData.trim() === '') {
            return { ...farmer, members: [] };
          }
          
          const parsed = JSON.parse(membersData);
          return { ...farmer, members: Array.isArray(parsed) ? parsed : [] };
        }
        
        // Fallback for any other data type
        return { ...farmer, members: [] };
      } catch (parseError) {
        console.error(`❌ Error parsing members for farmer ${farmer.id}:`, parseError);
        console.error('Raw members data:', farmer.members);
        return { ...farmer, members: [] };
      }
    });

    console.log('✅ Returning successful response with farmers data');
    return NextResponse.json({
      data: farmersWithParsedMembers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('❌ Unexpected error in farmers API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      {
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
      },
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

    // Only allow users with ADMIN or SUPER_ADMIN roles to create farmer data
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

    const body: CreateFarmerInput = await request.json();
    const { name, group, chairman, members, userId } = body;

    // Validate required fields
    if (!name || !group || !chairman || !members) {
      return NextResponse.json(
        { message: 'Name, group, chairman, and members are required' },
        { status: 400 }
      );
    }

    const farmer = await prisma.farmer.create({
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

    // Convert members JSON back to array for response with error handling
    let parsedMembers;
    try {
      parsedMembers = Array.isArray(farmer.members) ? farmer.members : JSON.parse(farmer.members as string);
    } catch (error) {
      console.error('Error parsing members for created farmer:', farmer.id, error);
      parsedMembers = []; // Default to empty array on parsing error
    }

    const farmerResponse = {
      ...farmer,
      members: parsedMembers,
    };

    return NextResponse.json(farmerResponse, { status: 201 });
  } catch (error) {
    console.error('Error creating farmer:', error);
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

    // Only allow users with ADMIN or SUPER_ADMIN roles to delete farmer data
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
      return NextResponse.json({ message: 'ID is required' }, { status: 400 });
    }

    // Check if farmer exists
    const farmer = await prisma.farmer.findUnique({
      where: { id },
    });

    if (!farmer) {
      return NextResponse.json({ message: 'Farmer not found' }, { status: 404 });
    }

    // Delete the farmer
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
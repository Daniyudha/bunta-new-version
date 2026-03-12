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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const role = await prisma.role.findUnique({
      where: { id },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
        users: true,
      },
    });

    if (!role) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }

    return NextResponse.json(role);
  } catch (error) {
    console.error('Error fetching role:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const { name, description, isDefault, permissionIds } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Check if role exists
    const existingRole = await prisma.role.findUnique({
      where: { id },
    });

    if (!existingRole) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }

    // Prevent editing of SUPER_ADMIN role name
    if (existingRole.name === 'SUPER_ADMIN' && name !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Cannot change SUPER_ADMIN role name' },
        { status: 400 }
      );
    }

    // Check if name is already taken by another role
    const roleWithSameName = await prisma.role.findFirst({
      where: {
        name,
        id: { not: id },
      },
    });

    if (roleWithSameName) {
      return NextResponse.json(
        { error: 'Role name already exists' },
        { status: 409 }
      );
    }

    // Update role with permissions
    const role = await prisma.role.update({
      where: { id },
      data: {
        name,
        description,
        isDefault: isDefault || false,
        permissions: {
          deleteMany: {}, // Remove all existing permissions
          create: permissionIds?.map((permissionId: string) => ({
            permissionId,
          })) || [],
        },
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    return NextResponse.json(role);
  } catch (error) {
    console.error('Error updating role:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if role exists
    const existingRole = await prisma.role.findUnique({
      where: { id },
    });

    if (!existingRole) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }

    // Prevent deletion of SUPER_ADMIN role
    if (existingRole.name === 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Cannot delete SUPER_ADMIN role' },
        { status: 400 }
      );
    }

    // Check if role is assigned to any users
    const usersWithRole = await prisma.user.count({
      where: { roleId: id },
    });

    if (usersWithRole > 0) {
      return NextResponse.json(
        { error: 'Cannot delete role that is assigned to users' },
        { status: 409 }
      );
    }

    // Delete role permissions first (due to foreign key constraints)
    await prisma.rolePermission.deleteMany({
      where: { roleId: id },
    });

    // Delete the role
    await prisma.role.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Role deleted successfully' });
  } catch (error) {
    console.error('Error deleting role:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
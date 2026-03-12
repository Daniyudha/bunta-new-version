import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;

    const file = await prisma.fileStorage.findUnique({
      where: { id }
    });

    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Check if file exists on disk
    if (!fs.existsSync(file.path)) {
      return NextResponse.json({ error: 'File not found on server' }, { status: 404 });
    }

    // Read file and send as download
    const fileBuffer = fs.readFileSync(file.path);
    
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': file.mimeType,
        'Content-Disposition': `attachment; filename="${file.originalName}"`,
        'Content-Length': file.size.toString(),
      },
    });

  } catch (error) {
    console.error('Error downloading file:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;

    const file = await prisma.fileStorage.findUnique({
      where: { id }
    });

    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Check if user owns the file or is admin
    if (file.uploadedById !== session.user.id) {
      // Check if user has admin permissions
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: true
                }
              }
            }
          }
        }
      });

      const isAdmin = user?.role?.permissions.some(
        (rp) => rp.permission.name === 'storage:manage'
      );

      if (!isAdmin) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }
    }

    // Delete file from disk
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    // Delete from database
    await prisma.fileStorage.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'File deleted successfully' });

  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
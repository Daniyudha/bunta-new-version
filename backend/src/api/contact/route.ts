import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Add CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    console.log('Contact form submission received');
    console.log('Request headers:', Object.fromEntries(request.headers));
    
    // Parse request body
    let body: ContactFormData;
    try {
      body = await request.json();
      console.log('Request body:', body);
    } catch (parseError) {
      console.error('Failed to parse request JSON:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON format in request body' },
        { status: 400 }
      );
    }

    // Validate required fields (phone is optional)
    if (!body.name || !body.email || !body.subject || !body.message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Test database connection first
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { error: 'Database connection failed. Please check database configuration.' },
        { status: 500 }
      );
    }

    // Save to database (phone is optional)
    console.log('Attempting to save contact submission to database...');
    const submission = await prisma.contactSubmission.create({
      data: {
        name: body.name,
        email: body.email,
        subject: body.subject,
        message: body.message,
        phone: body.phone || null, // Handle optional phone field
        status: 'unread'
      }
    });
    console.log('Database save successful:', submission);

    // Log the submission
    console.log('Contact form submission saved:', {
      id: submission.id,
      name: submission.name,
      email: submission.email,
      subject: submission.subject,
      timestamp: submission.createdAt
    });

    return NextResponse.json(
      {
        message: 'Contact form submitted successfully',
        submissionId: submission.id
      },
      {
        status: 200,
        headers: corsHeaders
      }
    );

  } catch (error) {
    console.error('Error processing contact form:', error);
    
    // Handle Prisma errors specifically
    if (error instanceof Error) {
      console.error('Error details:', error.message, error.stack);
      
      // Return detailed error message for debugging
      const errorMessage = process.env.NODE_ENV === 'development'
        ? `Database error: ${error.message}`
        : 'Database error. Please check if the ContactSubmission table exists and migrations are applied.';
      
      if (error.message.includes('prisma') || error.message.includes('database')) {
        return NextResponse.json(
          { error: errorMessage },
          {
            status: 500,
            headers: corsHeaders
          }
        );
      }
    }
    
    // Ensure we always return JSON
    const errorMessage = process.env.NODE_ENV === 'development'
      ? `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}`
      : 'Internal server error. Please try again later.';
    
    return NextResponse.json(
      { error: errorMessage },
      {
        status: 500,
        headers: corsHeaders
      }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
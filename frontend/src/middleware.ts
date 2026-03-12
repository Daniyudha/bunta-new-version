import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Define admin routes that require authentication and authorization
const adminRoutes = [
  '/admin',
  '/admin/users',
  '/admin/roles',
  '/admin/permissions',
  '/admin/sliders',
  '/admin/media',
  '/admin/data',
  '/admin/settings',
  '/admin/contact-submissions'
];

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/api/auth',
  '/api/public',
  '/api/contact', // Add contact API to public routes
  '/news',
  '/gallery',
  '/data',
  '/irrigation',
  '/contact',
  '/about'
];

// Define API routes that require specific permissions
const apiPermissionRoutes: { [key: string]: string[] } = {
  '/api/admin/users': ['manage_users'],
  '/api/admin/roles': ['manage_roles'],
  '/api/admin/permissions': ['manage_permissions'],
  '/api/admin/sliders': ['manage_sliders'],
  '/api/admin/media': ['manage_media'],
  '/api/admin/data': ['manage_data'],
  '/api/admin/settings': ['manage_settings'],
  '/api/admin/contact-submissions': ['contact_submissions:read']
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is public
  const isPublicRoute = publicRoutes.some(route =>
    pathname === route || pathname.startsWith(route + '/')
  );

  console.log('Pathname:', pathname);
  console.log('Is public route:', isPublicRoute);

  if (isPublicRoute) {
    console.log('Allowing access to public route:', pathname);
    return NextResponse.next();
  }

  // Check if the route is an admin route
  const isAdminRoute = adminRoutes.some(route =>
    pathname === route || pathname.startsWith(route + '/')
  );

  console.log('Is admin route:', isAdminRoute);

  if (!isAdminRoute) {
    console.log('Not an admin route, allowing access:', pathname);
    return NextResponse.next();
  }

  // Get the JWT token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });

  // If no token, handle differently for API routes vs UI routes
  if (!token) {
    // For API routes, return 401 instead of redirect
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // For UI routes, redirect to login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    console.log('Middleware processing for path:', pathname);
    console.log('Token email:', token.email);
    console.log('Token sub:', token.sub);
    console.log('Token role:', token.role);
    console.log('Token data:', JSON.stringify(token, null, 2));
    
    // Use token data instead of querying database (Prisma doesn't work in edge runtime)
    const userRole = token.role as string;
    
    if (!userRole) {
      console.log('No role found in token, redirecting to login');
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('error', 'Authentication failed');
      return NextResponse.redirect(loginUrl);
    }

    // For admin UI routes, check if user has admin or super admin role
    if (isAdminRoute && !pathname.startsWith('/api/')) {
      console.log('Checking admin UI route access for role:', userRole);
      
      // Allow access for ADMIN and SUPER_ADMIN roles without specific permission check
      if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
        console.log('Access denied for role:', userRole);
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('error', 'Access denied');
        return NextResponse.redirect(loginUrl);
      }
      
      console.log('Access granted for role:', userRole);
    }

    // Add user info to request headers for API routes
    if (pathname.startsWith('/api/')) {
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', token.sub || '');
      requestHeaders.set('x-user-role', userRole);
      
      // Handle CORS for API routes, especially for file uploads
      if (request.method === 'OPTIONS') {
        const response = new NextResponse(null, { status: 200 });
        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-user-id, x-user-role');
        return response;
      }
      
      const response = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
      
      // Add CORS headers for all API responses
      response.headers.set('Access-Control-Allow-Origin', '*');
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-user-id, x-user-role');
      
      return response;
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error details:', error);
    if (error instanceof Error) {
      console.error('Error stack:', error.stack);
    }
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('error', 'Server error');
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
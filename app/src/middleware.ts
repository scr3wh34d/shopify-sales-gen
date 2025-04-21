// app/src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware is now simplified as authentication relies on Admin API token
// Access control is assumed to be handled at a higher level (network, deployment, etc.)
// Or a separate application-level auth could be added later.

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log(`Middleware invoked for path: ${pathname}. Allowing access.`);

  // No authentication checks here based on the Admin API token approach.
  // If specific application-level user auth is added later, checks would go here.
  
  return NextResponse.next(); // Allow request to proceed
}

// Configure the middleware to run on specific paths (or adjust as needed)
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Adjust this matcher if you want middleware to run on API routes 
     * or other specific paths later.
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 
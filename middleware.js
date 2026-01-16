import { NextResponse } from 'next/server';
import { verifyJWT } from './lib/auth';

export async function middleware(request) {
  // Auth verification is handled by individual route handlers (lib/auth.js)
  // because Middleware runs in Edge runtime where jsonwebtoken has compatibility issues.
  // We skip authentication here to prevent false 401s.
  // Routes /api/calculations (POST), /reply, and /users/me ALL check auth internally.

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};

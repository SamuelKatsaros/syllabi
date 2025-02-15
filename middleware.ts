import { NextRequest, NextResponse } from 'next/server';
import { subdomainToUniversityId } from '@/utils/universityMappings';
import themes from './themes.json';

export function middleware(req: NextRequest) {
  const url = new URL(req.url);
  let subdomain: string | undefined;

  const hostname = req.headers.get('host');
  if (hostname && hostname !== 'localhost:3000') {
    const parts = hostname.split('.');
    if (parts.length > 1) {
      subdomain = parts[0];
    }
  }

  // Allow /home access on all subdomains
  if (url.pathname === '/home') {
    return NextResponse.next();
  }

  // Special handling for home subdomain
  if (subdomain === 'home') {
    // Don't rewrite API routes for home subdomain
    if (url.pathname.startsWith('/api/')) {
      return NextResponse.next();
    }
    
    // Rewrite to the home page for non-API routes
    if (!url.pathname.startsWith('/home')) {
      return NextResponse.rewrite(new URL('/home', req.url));
    }
    return NextResponse.next();
  }

  // Let Next.js handle static files directly
  if (url.pathname.startsWith('/favicons/') || url.pathname.startsWith('/logos/') || url.pathname.startsWith('/_next/')) {
    return NextResponse.next();
  }

  // Handle favicon.ico requests
  if (url.pathname === '/favicon.ico') {
    const universityId = subdomain ? subdomainToUniversityId(subdomain) : 'default';
    const theme = themes[universityId as keyof typeof themes] || themes.default;
    return NextResponse.rewrite(new URL(theme.favicon, req.url));
  }

  // Regular request handling for university subdomains
  if (subdomain && subdomain !== 'home') {
    const universityId = subdomainToUniversityId(subdomain);
    url.searchParams.set("subdomain", subdomain);
    url.searchParams.set("university", universityId);
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

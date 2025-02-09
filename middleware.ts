import { NextRequest, NextResponse } from 'next/server';
import { subdomainToUniversityId } from '@/utils/universityMappings';

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

  // Handle all favicon-related requests including direct .ico files
  if (url.pathname === '/favicon.ico' || 
      url.pathname.startsWith('/favicons/') || 
      url.pathname.endsWith('.ico')) {
    console.log('Favicon request:', { subdomain, path: url.pathname });
    const faviconUrl = new URL('/api/favicon', req.url);
    if (subdomain) {
      faviconUrl.searchParams.set('subdomain', subdomain);
    }
    return NextResponse.rewrite(faviconUrl);
  }

  // Regular request handling
  if (!subdomain) {
    subdomain = url.searchParams.get('subdomain') || undefined;
    if (!subdomain) {
      return NextResponse.json({ error: "Subdomain missing" }, { status: 400 });
    }
  }

  const universityId = subdomainToUniversityId(subdomain);
  url.searchParams.set("subdomain", subdomain);
  url.searchParams.set("university", universityId);
  
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!api|_next/static|_next/image|_next/data).*)',
    '/favicon.ico',
    '/favicons/:path*',
    '/:subdomain.ico'
  ]
};

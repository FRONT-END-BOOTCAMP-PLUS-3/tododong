import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './utils/auth';

export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', request.nextUrl.pathname);

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value || null;

  if (!accessToken) {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  const decoded = await verifyToken(accessToken);

  if (!decoded) {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  requestHeaders.set(
    'x-user-info',
    Buffer.from(JSON.stringify(decoded)).toString('base64')
  );

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

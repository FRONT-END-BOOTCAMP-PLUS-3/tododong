import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './utils/auth';

export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', request.nextUrl.pathname);

  const accessToken = request.cookies.get('access_token')?.value || null;

  if (!accessToken) {
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    return response;
  }

  const decoded = await verifyToken(accessToken);

  if (!decoded) {
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    return response;
  }

  requestHeaders.set(
    'x-user-info',
    Buffer.from(JSON.stringify(decoded)).toString('base64')
  );

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  response.cookies.set('access_token', accessToken, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 1 * 60, // 1분
  });

  return response;
}

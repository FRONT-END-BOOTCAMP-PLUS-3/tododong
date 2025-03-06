import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', request.nextUrl.pathname);

  const accessToken = request.cookies.get('accessToken')?.value || null;

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  if (accessToken) {
    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 1 * 60, // 1분
    });
  }

  return response;
}

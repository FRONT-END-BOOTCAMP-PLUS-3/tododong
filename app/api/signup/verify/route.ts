import { NextResponse } from 'next/server';

// 이메일 인증 API
export async function POST(request: Request) {
  const { email } = await request.json();

  return NextResponse.json({
    message: '인증번호가 이메일로 전송되었습니다.',
  });
}

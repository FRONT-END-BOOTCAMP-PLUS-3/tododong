import { NextResponse } from 'next/server';

// 인증번호 확인 API
export async function POST(request: Request) {
  const { email, code } = await request.json();

  return NextResponse.json({ message: '인증 성공' });
  // return NextResponse.json({ error: '인증 실패' }, { status: 400 });
}

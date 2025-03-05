import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  const { email, password } = await req.json();

  console.log('로그인 api요청:', { email, password });
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const token = 'asdf';

  return NextResponse.json({ token }, { status: 200 });
  // return NextResponse.json({ error: '로그인 실패' }, { status: 400 });
};

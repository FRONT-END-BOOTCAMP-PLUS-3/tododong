import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  const { email, password } = await req.json();

  console.log(email, password);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return NextResponse.json({ error: '로그인 실패' }, { status: 400 });
  // return NextResponse.json({ message: '로그인 성공' }, { status: 200 });
};

import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  const { email, password, nickName } = await req.json();

  console.log(email, password, nickName);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return NextResponse.json({ message: '회원가입 성공' }, { status: 200 });
  // return NextResponse.json({ error: '회원가입 실패' }, { status: 400 });
};

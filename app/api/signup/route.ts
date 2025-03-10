import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  const { email, password, nickname } = await req.json();

  console.log(email, password, nickname);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // return NextResponse.json({ message: '회원가입 성공' }, { status: 200 });
  return NextResponse.json({ error: '닉네임 중복' }, { status: 400 });
};

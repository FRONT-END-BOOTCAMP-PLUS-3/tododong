import { signupUsecase } from '@/application/usecases/user/signupUsecase';
import PrUserRepository from '@/infrastructure/repositories/prisma/PrUserRepository';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  try {
    await signupUsecase(new PrUserRepository(), body);

    return NextResponse.json({ message: '회원가입 성공' }, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.message === '닉네임 중복')
        return NextResponse.json({ error: '닉네임 중복' }, { status: 409 });
    }
    return NextResponse.json({ error: '회원가입 실패' }, { status: 400 });
  }
};

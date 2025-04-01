import { restoreUserUsecase } from '@/application/usecases/user/restoreUserUsecase';
import PrUserRepository from '@/infrastructure/repositories/prisma/PrUserRepository';
import { NextRequest, NextResponse } from 'next/server';

export const PATCH = async (req: NextRequest) => {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json(
      { message: '이메일을 입력해주세요.' },
      { status: 400 }
    );
  }

  await restoreUserUsecase(new PrUserRepository(), email);

  return NextResponse.json({ message: '계정 복구 완료' }, { status: 200 });
};

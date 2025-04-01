import { checkVerificationCodeUsecase } from '@/application/usecases/user/checkVerificationCodeUsecase';
import PrUserRepository from '@/infrastructure/repositories/prisma/PrUserRepository';
import PrVerificationCodeRepository from '@/infrastructure/repositories/prisma/PrVerificationCodeRepository';
import { NextResponse } from 'next/server';

// 인증번호 확인 API
export const POST = async (request: Request) => {
  const { email, code } = await request.json();

  if (!email || !code) {
    return NextResponse.json(
      { message: '이메일과 인증 코드를 입력해주세요.' },
      { status: 400 }
    );
  }

  try {
    const result = await checkVerificationCodeUsecase(
      new PrUserRepository(),
      new PrVerificationCodeRepository(),
      { email, code }
    );
    if (result) return NextResponse.json({ message: '인증 성공' });
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.message === '30일 이내에 탈퇴한 이메일입니다.') {
        return NextResponse.json(
          { error: '30일 이내에 탈퇴한 이메일입니다.' },
          { status: 409 }
        );
      }
    }
  }

  return NextResponse.json({ error: '인증 실패' }, { status: 400 });
};

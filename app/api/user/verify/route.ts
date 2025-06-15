import { sendVerificationEmailUsecase } from '@/application/usecases/user/sendVerificationEmailUsecase';
import PrUserRepository from '@/infrastructure/repositories/prisma/PrUserRepository';
import PrVerificationCodeRepository from '@/infrastructure/repositories/prisma/PrVerificationCodeRepository';
import { NextResponse } from 'next/server';

// 이메일 인증 API
export const POST = async (request: Request) => {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json(
      { message: '이메일을 입력해주세요.' },
      { status: 400 }
    );
  }

  try {
    await sendVerificationEmailUsecase(
      new PrVerificationCodeRepository(),
      new PrUserRepository(),
      email
    );

    return NextResponse.json({
      message: '인증번호가 이메일로 전송되었습니다.',
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === '이메일 중복') {
      return NextResponse.json(
        { error: '이미 가입된 이메일입니다.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: '인증번호 전송에 실패했습니다.' },
      { status: 500 }
    );
  }
};

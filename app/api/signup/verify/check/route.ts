import { checkVerificationCodeUsecase } from '@/application/usecases/user/checkVerificationCodeUsecase';
import PrVerificationCodeRepository from '@/infrastructure/repositories/prisma/PrVerificationCodeRepository';
import { NextResponse } from 'next/server';

// 인증번호 확인 API
export async function POST(request: Request) {
  const { email, code } = await request.json();

  if (!email || !code) {
    return NextResponse.json(
      { message: '이메일과 인증 코드를 입력해주세요.' },
      { status: 400 }
    );
  }

  const result = await checkVerificationCodeUsecase(
    new PrVerificationCodeRepository(),
    { email, code }
  );

  if (result) return NextResponse.json({ message: '인증 성공' });
  return NextResponse.json({ error: '인증 실패' }, { status: 400 });
}

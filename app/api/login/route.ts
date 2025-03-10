import { loginUsecase } from '@/application/usecases/user/loginUsecase';
import PrUserRepository from '@/infrastructure/repositories/prisma/PrUserRepository';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  try {
    // 요청 본문 데이터 추출
    const { email, password } = await req.json();

    // 유효성 검사
    if (!email || !password) {
      return NextResponse.json(
        { message: '이메일과 비밀번호를 입력해주세요.' },
        { status: 400 }
      );
    }

    const { accessToken } = await loginUsecase(new PrUserRepository(), {
      email,
      password,
    });

    // 응답 반환
    return NextResponse.json({ accessToken }, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
};

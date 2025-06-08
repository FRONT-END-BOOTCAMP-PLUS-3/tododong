import { modifyUserUsecase } from '@/application/usecases/user/modifyUserUsecase';
import { signupUsecase } from '@/application/usecases/user/signupUsecase';
import PrUserRepository from '@/infrastructure/repositories/prisma/PrUserRepository';
import { verifyToken } from '@/utils/auth';
import { cookies } from 'next/headers';
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
      if (err.message === '이메일 중복')
        return NextResponse.json({ error: '이메일 중복' }, { status: 409 });
    }
    return NextResponse.json({ error: '회원가입 실패' }, { status: 400 });
  }
};

export const PATCH = async (req: NextRequest) => {
  const body = await req.json();
  const cookieStore = await cookies();

  const accessToken = req.cookies.get('accessToken')?.value || '';

  let userInfo;

  // 토큰이 존재할 때, 토큰이 유효한지 검증 -> 유효하다면 userId 꺼내기
  if (accessToken) {
    const decoded = await verifyToken(accessToken);
    if (decoded) userInfo = decoded;
    else
      return NextResponse.json({
        error: '토큰이 만료되었습니다.',
        status: 400,
      });
  }

  if (!userInfo)
    return NextResponse.json(
      { error: '로그인이 필요합니다.' },
      { status: 401 }
    );

  const newUserInfo = { ...userInfo, ...body };

  const { accessToken: newAccessToken } = await modifyUserUsecase(
    new PrUserRepository(),
    newUserInfo
  );

  cookieStore.set('accessToken', newAccessToken);

  return NextResponse.json(
    { message: '사용자 정보가 변경되었습니다.' },
    { status: 200 }
  );
};

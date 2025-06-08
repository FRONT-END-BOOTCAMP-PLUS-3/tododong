import { deleteUserUsecase } from '@/application/usecases/user/deleteUserUsecase';
import PrUserRepository from '@/infrastructure/repositories/prisma/PrUserRepository';
import { verifyToken } from '@/utils/auth';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const PATCH = async (req: NextRequest) => {
  const cookieStore = await cookies();
  const accessToken = req.cookies.get('accessToken')?.value || '';

  let userInfo;

  // 토큰이 존재할 때, 토큰이 유효한지 검증 -> 유효하다면 userInfo 꺼내기
  if (accessToken) {
    const decoded = await verifyToken(accessToken);
    if (decoded) userInfo = decoded;
    else
      return NextResponse.json({
        error: '토큰이 만료되었습니다.',
        status: 400,
      });
  }

  if (!userInfo || !userInfo.id) {
    return NextResponse.json(
      { error: '로그인이 필요합니다.' },
      { status: 401 }
    );
  }

  await deleteUserUsecase(new PrUserRepository(), userInfo.id as string);

  cookieStore.delete('accessToken');

  return NextResponse.json({ message: '계정 삭제 완료' }, { status: 200 });
};

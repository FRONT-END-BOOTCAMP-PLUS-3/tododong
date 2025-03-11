import { NextRequest, NextResponse } from 'next/server';
import { DfMessageRepository } from '@/infrastructure/repositories/DfMessageRepository';
import { getChatMessagesUseCase } from '@/application/usecases/chat/getChatMessagesUseCase';
import { createMessageUsecase } from '@/application/usecases/chat/createChatMessageUsecase';
import { cookies } from 'next/headers';
import { verifyToken } from '@/utils/auth';
import { JWTPayload } from 'jose';

interface JWTPayloadWithUser extends JWTPayload {
  id: string;
  nickname: string;
} // JWTPayload에 이런 속성과 타입이 있다는 것을 알려줌 -> 새로운 타입으로 지정

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ 'game-id': string }> }
) => {
  const slug = await params;
  const gameId = slug['game-id'];

  const repository = new DfMessageRepository();

  if (!gameId) {
    return NextResponse.json({ error: 'Invalid gameId' }, { status: 400 });
  }

  const result = await getChatMessagesUseCase(repository, gameId);

  return NextResponse.json(result, { status: 200 });
};

// gameId, userId, message
export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ 'game-id': string }> }
) => {
  const slug = await params;
  const gameId = slug['game-id'];

  const body = await req.json();
  const { message } = body;

  // 쿠키에서 토큰 꺼내고, 토큰에서 user정보 꺼내기
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value || '';

  let userInfo: JWTPayloadWithUser = { id: '', nickname: '' };

  // 토큰이 존재할 때, 토큰이 유효한지 검증 -> 유효하다면 userId 꺼내기
  if (accessToken) {
    const decoded = (await verifyToken(accessToken)) as JWTPayloadWithUser;
    if (decoded) userInfo = decoded;
    else
      return NextResponse.json({
        message: '토큰이 만료되었습니다.',
        status: 400,
      });
  }

  const repository = new DfMessageRepository();
  if (!gameId) {
    return NextResponse.json({ error: 'Invalid gameId' }, { status: 400 });
  }

  await createMessageUsecase(repository, {
    message,
    gameId,
    userId: userInfo.id,
    userNickname: userInfo.nickname,
  });

  return NextResponse.json({ status: 200 });
};

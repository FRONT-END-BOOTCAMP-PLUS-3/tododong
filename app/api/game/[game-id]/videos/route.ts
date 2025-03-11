import { getYoutubeVideosUsecase } from '@/application/usecases/game/videos/getYoutubeVideosUsecase';
import { PrGameRepository } from '@/infrastructure/repositories/prisma/PrGameRepository';
import { PrTeamRepository } from '@/infrastructure/repositories/prisma/PrTeamRepository';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ 'game-id': string }> }
) => {
  const slug = await params;
  const gameId = slug['game-id'];

  const gameRepository = new PrGameRepository();
  const teamRepository = new PrTeamRepository();
  const videos = await getYoutubeVideosUsecase(
    gameId,
    gameRepository,
    teamRepository
  );

  return NextResponse.json(videos, { status: 200 });
};

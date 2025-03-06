import { getYoutubeVideosUsecase } from '@/application/usecases/game/videos/getYoutubeVideosUsecase';
import { DfGameRepository } from '@/infrastructure/repositories/DfGameRepository';
import { DfTeamRepository } from '@/infrastructure/repositories/DfTeamRepository';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ 'game-id': string }> }
) => {
  const slug = await params;
  const gameId = slug['game-id'];

  const gameRepository = new DfGameRepository();
  const teamRepository = new DfTeamRepository();
  const videos = await getYoutubeVideosUsecase(
    gameId,
    gameRepository,
    teamRepository
  );

  return NextResponse.json(videos, { status: 200 });
};

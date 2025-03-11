import { readPlaybyplayUsecase } from '@/application/usecases/game/play-by-play/readPlaybyplayUsecase';
import { NbaOfficialPlaybyPlayRpository } from '@/infrastructure/repositories/nbaOfficial/NbaOfficialPlaybyplayRepository';
import { PrGameRepository } from '@/infrastructure/repositories/prisma/PrGameRepository';
import { PrTeamRepository } from '@/infrastructure/repositories/prisma/PrTeamRepository';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ 'game-id': string }> }
) => {
  const slug = await params;
  const gameId = slug['game-id'];

  const playbyplayRepository = new NbaOfficialPlaybyPlayRpository();
  const teamRepository = new PrTeamRepository();
  const gameRepository = new PrGameRepository();

  const result = await readPlaybyplayUsecase(
    gameId,
    gameRepository,
    teamRepository,
    playbyplayRepository
  );

  return NextResponse.json(result, { status: 200 });
};

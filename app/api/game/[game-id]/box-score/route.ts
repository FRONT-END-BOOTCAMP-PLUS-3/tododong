import { readBoxscoreUsecase } from '@/application/usecases/game/box-score/readBoxscoreUsecase';
import { PrGameRepository } from '@/infrastructure/repositories/prisma/PrGameRepository';
import { PrTeamRepository } from '@/infrastructure/repositories/prisma/PrTeamRepository';
import { NbaOfficialStatisticsRpository } from '@/infrastructure/repositories/nbaOfficial/NbaOfficialStatisticsRepository';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ 'game-id': string }> }
) => {
  const slug = await params;
  const gameId = slug['game-id'];

  const statisticsRepository = new NbaOfficialStatisticsRpository();
  const teamRepository = new PrTeamRepository();
  const gameRepository = new PrGameRepository();

  const result = await readBoxscoreUsecase(
    gameId,
    gameRepository,
    teamRepository,
    statisticsRepository
  );

  return NextResponse.json(result, { status: 200 });
};

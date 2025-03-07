import { readBoxscoreUsecase } from '@/application/usecases/game/box-score/readBoxscoreUsecase';
import { DfGameRepository } from '@/infrastructure/repositories/DfGameRepository';
import { DfTeamRepository } from '@/infrastructure/repositories/DfTeamRepository';
import { NbaOfficialStatisticsRpository } from '@/infrastructure/repositories/NbaOfficialStatisticsRepository';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ 'game-id': string }> }
) => {
  const slug = await params;
  const gameId = slug['game-id'];

  const statisticsRepository = new NbaOfficialStatisticsRpository();
  const teamRepository = new DfTeamRepository();
  const gameRepository = new DfGameRepository();

  const result = await readBoxscoreUsecase(
    gameId,
    gameRepository,
    teamRepository,
    statisticsRepository
  );

  return NextResponse.json(result, { status: 200 });
};

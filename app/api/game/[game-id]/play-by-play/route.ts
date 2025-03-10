import { readPlaybyplayUsecase } from '@/application/usecases/game/play-by-play/readPlaybyplayUsecase';
import { DfGameRepository } from '@/infrastructure/repositories/DfGameRepository';
import { DfTeamRepository } from '@/infrastructure/repositories/DfTeamRepository';
import { NbaOfficialPlaybyPlayRpository } from '@/infrastructure/repositories/NbaOfficialPlaybyplayRepository';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ 'game-id': string }> }
) => {
  const slug = await params;
  const gameId = slug['game-id'];

  const playbyplayRepository = new NbaOfficialPlaybyPlayRpository();
  const teamRepository = new DfTeamRepository();
  const gameRepository = new DfGameRepository();

  const result = await readPlaybyplayUsecase(
    gameId,
    gameRepository,
    teamRepository,
    playbyplayRepository
  );

  return NextResponse.json(result, { status: 200 });
};

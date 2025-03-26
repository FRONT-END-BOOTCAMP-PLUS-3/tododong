import { GameDetailDto } from '@/application/usecases/game/game-detail/dto/gameDetailDto';
import { getGameDetailUsecase } from '@/application/usecases/game/game-detail/getGameDetailUsecase';
import { NbaOfficialGameRpository } from '@/infrastructure/repositories/nbaOfficial/NbaOfficialGameRepository';
import { PrGameRepository } from '@/infrastructure/repositories/prisma/PrGameRepository';
import { PrTeamRepository } from '@/infrastructure/repositories/prisma/PrTeamRepository';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ 'game-id': string }> }
) => {
  const slug = await params;
  const gameId = slug['game-id'];
  const internalGameRepository = new PrGameRepository();
  const externalGameRepository = new NbaOfficialGameRpository();
  const teamRepository = new PrTeamRepository();

  if (!gameId) {
    return NextResponse.json({ error: 'Invalid gameId' }, { status: 400 });
  }

  const result: GameDetailDto = await getGameDetailUsecase(
    internalGameRepository,
    externalGameRepository,
    teamRepository,
    gameId
  );

  return NextResponse.json(result, { status: 200 });
};

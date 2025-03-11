import { ScheduledGameDto } from '@/application/usecases/schedule/dto/ScheduledGameDto';
import { migrateTodayGamesToLocalUsecase } from '@/application/usecases/game/migrateTodayGamesToLocalUsecase';
import { readScheduledGameListUsecase } from '@/application/usecases/schedule/readScheduledGameListUsecase';
import { NbaOfficialGameRpository } from '@/infrastructure/repositories/nbaOfficial/NbaOfficialGameRepository';
import { PrGameRepository } from '@/infrastructure/repositories/prisma/PrGameRepository';
import { PrTeamRepository } from '@/infrastructure/repositories/prisma/PrTeamRepository';
import dayjs from 'dayjs';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ date: string }> }
) => {
  try {
    const { date } = await params;
    const nbaOfficialgameRepository = new NbaOfficialGameRpository();
    const gameRepository = new PrGameRepository();
    const teamRepository = new PrTeamRepository();

    if (date === dayjs().format('YYYY-MM-DD')) {
      await migrateTodayGamesToLocalUsecase(
        nbaOfficialgameRepository,
        gameRepository
      );
    }

    const result: ScheduledGameDto[] = await readScheduledGameListUsecase(
      date,
      gameRepository,
      teamRepository
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.log(error);
  }
};

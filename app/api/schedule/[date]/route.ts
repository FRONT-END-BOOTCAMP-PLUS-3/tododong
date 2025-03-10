import { ScheduledGameDto } from '@/application/usecases/schedule/dto/ScheduledGameDto';
import { migrateTodayGamesToLocalUsecase } from '@/application/usecases/game/migrateTodayGamesToLocalUsecase';
import { readScheduledGameListUsecase } from '@/application/usecases/schedule/readScheduledGameListUsecase';
import { DfGameRepository } from '@/infrastructure/repositories/DfGameRepository';
import { DfTeamRepository } from '@/infrastructure/repositories/DfTeamRepository';
import { NbaOfficialGameRpository } from '@/infrastructure/repositories/NbaOfficialGameRepository';
import dayjs from 'dayjs';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ date: string }> }
) => {
  try {
    const { date } = await params;
    const nbaOfficialgameRepository = new NbaOfficialGameRpository();
    const gameRepository = new DfGameRepository();
    const teamRepository = new DfTeamRepository();

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

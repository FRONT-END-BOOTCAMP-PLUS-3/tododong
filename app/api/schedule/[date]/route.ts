import { ScheduledGameDto } from '@/application/usecases/schedule/dto/ScheduledGameDto';
import { readScheduledGameListUsecase } from '@/application/usecases/schedule/readScheduledGameListUsecase';
import { readTodayGameListUsecase } from '@/application/usecases/schedule/readTodayGameListUsecase';
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
    const today = dayjs().format('YYYY-MM-DD');
    const nbaOfficialGameRepository = new NbaOfficialGameRpository();
    const gameRepository = new PrGameRepository();
    const teamRepository = new PrTeamRepository();

    const result: ScheduledGameDto[] =
      date === today
        ? await readTodayGameListUsecase(
            nbaOfficialGameRepository,
            teamRepository
          )
        : await readScheduledGameListUsecase(
            date,
            gameRepository,
            teamRepository
          );

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.log(error);
  }
};

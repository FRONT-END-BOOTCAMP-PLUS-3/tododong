import { NbaOfficialGameRpository } from '@/infrastructure/repositories/nbaOfficial/NbaOfficialGameRepository';
import { ScheduledGameCountDto } from '@/application/usecases/schedule/dto/ScheduledGameCountDto';
import { readScheduledGameCountListUsecase } from '@/application/usecases/schedule/readScheduledGameCountListUsecase';
import { NextResponse } from 'next/server';

export const GET = async () => {
  try {
    const gameRepository = new NbaOfficialGameRpository();

    const result: ScheduledGameCountDto[] =
      await readScheduledGameCountListUsecase(gameRepository);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.log(error);
  }
};

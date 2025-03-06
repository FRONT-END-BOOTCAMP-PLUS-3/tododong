import { ScheduledGameCountListUsecase } from '@/application/usecases/schedule/ScheduledGameCountListUsecase';
import { DfGameRepository } from '@/infrastructure/repositories/DfGameRepository';
import { NextResponse } from 'next/server';

export const GET = async () => {
  try {
    const gameRepository = new DfGameRepository();

    const result = await ScheduledGameCountListUsecase(gameRepository);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.log(error);
  }
};

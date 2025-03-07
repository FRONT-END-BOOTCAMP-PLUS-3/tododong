import { readScheduledGameCountListUsecase } from '@/application/usecases/schedule/readScheduledGameCountListUsecase';
import { DfGameRepository } from '@/infrastructure/repositories/DfGameRepository';
import { NextResponse } from 'next/server';

export const GET = async () => {
  try {
    const gameRepository = new DfGameRepository();

    const result = await readScheduledGameCountListUsecase(gameRepository);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.log(error);
  }
};

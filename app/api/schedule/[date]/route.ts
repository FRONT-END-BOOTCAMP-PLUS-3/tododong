import { readScheduledGameListUsecase } from '@/application/usecases/schedule/readScheduledGameListUsecase';
import { DfGameRepository } from '@/infrastructure/repositories/DfGameRepository';
import { DfTeamRepository } from '@/infrastructure/repositories/DfTeamRepository';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ date: string }> }
) => {
  try {
    const { date } = await params;
    const gameRepository = new DfGameRepository();
    const teamRepository = new DfTeamRepository();

    const result = await readScheduledGameListUsecase(
      date,
      gameRepository,
      teamRepository
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.log(error);
  }
};

import { PrGameRepository } from '@/infrastructure/repositories/prisma/PrGameRepository';
import { ScheduledGameCountDto } from '@/application/usecases/schedule/dto/ScheduledGameCountDto';
import { readScheduledGameCountListUsecase } from '@/application/usecases/schedule/readScheduledGameCountListUsecase';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const year = parseInt(url.searchParams.get('year') || '');
    const month = parseInt(url.searchParams.get('month') || '');

    if (!year || !month) {
      return NextResponse.json(
        { error: 'year와 month를 입력하세요' },
        { status: 400 }
      );
    }

    const gameRepository = new PrGameRepository();
    const result = await readScheduledGameCountListUsecase(
      gameRepository,
      year,
      month
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.log(error);
  }
};

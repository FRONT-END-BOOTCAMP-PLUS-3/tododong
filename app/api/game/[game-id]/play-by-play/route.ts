import { mockData } from '@/app/(anon)/game/[game-id]/play-by-play/mockData';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  const { gameId } = await req.json();

  const result = mockData;

  //   await new Promise((resolve) => setTimeout(resolve, 1000));
  //   return NextResponse.json({ error: '로그인 실패' }, { status: 400 });

  return NextResponse.json(result, { status: 200 });
};

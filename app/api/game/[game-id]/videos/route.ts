import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  const { gameId } = await req.json();

  const result = {
    game: { id: gameId, status: 'live', date: '2025-02-21' },
    home: {
      name: 'Indiana Pacers',
    },
    away: { name: 'Memphis Grizzlies' },
  };

  //   await new Promise((resolve) => setTimeout(resolve, 1000));
  //   return NextResponse.json({ error: '로그인 실패' }, { status: 400 });

  return NextResponse.json(result, { status: 200 });
};

import GameStatus from '@/types/game-status';

export interface ScheduledGameDto {
  gameId: string;
  gameStatus: GameStatus;
  startTime: {
    date: string;
    time: string;
  };
  teams: {
    homeTeam: {
      name: string;
      logoSrc: string;
      score: number;
      isWinner: boolean;
    };
    awayTeam: {
      name: string;
      logoSrc: string;
      score: number;
      isWinner: boolean;
    };
  };
}

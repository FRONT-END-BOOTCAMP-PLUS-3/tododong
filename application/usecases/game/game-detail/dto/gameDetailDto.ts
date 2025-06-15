import GameStatus from '@/types/game-status';

interface TeamDto {
  name: string;
  code: string;
  logoSrc: string;
  score: number;
  periods: number[];
  isWinner: boolean;
}

export interface GameDetailDto {
  gameId: string;
  gameStatus: GameStatus;
  arenaName: string;
  startTime: {
    date: string;
    time: string;
  };
  teams: {
    homeTeam: TeamDto;
    awayTeam: TeamDto;
  };
}

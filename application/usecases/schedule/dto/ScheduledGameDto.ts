import GameStatus from '@/types/game-status';

interface TeamDto {
  name: string;
  logoSrc: string;
  score: number;
  isWinner: boolean;
}

export interface ScheduledGameDto {
  gameId: string;
  gameStatus: GameStatus;
  startTime: {
    date: string;
    time: string;
  };
  teams: {
    homeTeam: TeamDto;
    awayTeam: TeamDto;
  };
}

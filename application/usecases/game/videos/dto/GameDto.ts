export interface GameDto {
  id: string;
  season: number;
  status: string;
  arenaName: string;
  awayTeamId: string;
  awayTeamPeriods: number[];
  awayTeamScore: number;
  homeTeamId: string;
  homeTeamPeriods: number[];
  homeTeamScore: number;
  date: string;
  startTime: string;
  query?: string;
}

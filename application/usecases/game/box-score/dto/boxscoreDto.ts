export interface StatisticsDto {
  name: string;
  assists: number;
  blocks: number;
  fieldGoalsAttempted: number;
  fieldGoalsMade: number;
  fieldGoalsPercentage: number;
  fouls: number;
  freeThrowsAttempted: number;
  freeThrowsMade: number;
  freeThrowsPercentage: number;
  minutes: string | null;
  plusMinus: number;
  points: number;
  reboundsDefensive: number;
  reboundsOffensive: number;
  reboundsTotal: number;
  steals: number;
  threePointersAttempted: number;
  threePointersMade: number;
  threePointersPercentage: number;
  turnovers: number;
}

export interface TeamDto {
  id: string;
  name: string;
  city: string;
  logo: string;
  players: StatisticsDto[];
}

export interface BoxscoreDto {
  game: {
    id: string;
    status: string;
  };
  homeTeam: TeamDto;
  awayTeam: TeamDto;
}

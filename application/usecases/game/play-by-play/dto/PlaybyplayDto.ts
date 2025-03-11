export interface EventDto {
  gameId: string;
  teamId: string | null;
  clock: string;
  period: number;
  periodType: string;
  actionType: string;
  scoreAway: string;
  scoreHome: string;
  shotResult: string | null;
  description: string;
  descriptionKor: string;
  playerName: string | null;
  edited: string;
}

interface TeamDto {
  id: string;
  name: string;
  city: string;
  logo: string;
}

export interface PlaybyplayDto {
  game: {
    gameId: string;
    date: string;
    status: string;
    events: EventDto[][] | [];
  };
  homeTeam: TeamDto;
  awayTeam: TeamDto;
}

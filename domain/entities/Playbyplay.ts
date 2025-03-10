export interface Playbyplay {
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
  playerName: string | null;
  edited: string;
}

import { PlaybyplayRepository } from '@/domain/repositories/PlaybyPlayRepository';
import { Playbyplay } from '@/domain/entities/Playbyplay';

interface Action {
  gameId: string;
  teamId: number;
  clock: string;
  period: number;
  periodType: string;
  actionType: string;
  scoreAway: string;
  scoreHome: string;
  shotResult: string;
  description: string;
  playerNameI: string;
  edited: string;
}

export class NbaOfficialPlaybyPlayRpository implements PlaybyplayRepository {
  async findById(gameId: string): Promise<Playbyplay[]> {
    const url = `${process.env.NEXT_PUBLIC_NBA_PLAYBYPLAY_URL}_${gameId}.json`;

    try {
      const response = await fetch(url);
      const result = await response.json();

      const playbyplay = result.game.actions.map((action: Action) => ({
        gameId: result.game.gameId,
        teamId: action.teamId ?? null,
        clock: action.clock,
        period: action.period,
        periodType: action.periodType,
        actionType: action.actionType,
        scoreAway: action.scoreAway,
        scoreHome: action.scoreHome,
        shotResult: action.shotResult ?? null,
        description: action.description,
        playerName: action.playerNameI ?? null,
        edited: action.edited,
      }));

      return playbyplay;
    } catch (error) {
      console.error(error);
      throw new Error('PlaybyPlay 데이터 불러오기 실패');
    }
  }
}

import { Game } from '@prisma/client';

export interface GameRepository {
  findById: (id: string) => Promise<Game | null>;
  saveGames: (games: Game[]) => Promise<void>;
}

import { Game } from '@prisma/client';

export interface GameRepository {
  findAll: () => Promise<Game[]>;
  findByDate?: (date: string) => Promise<Game[]>;
  saveGames?: (games: Game[]) => Promise<void>;
}

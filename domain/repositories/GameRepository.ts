import { Game } from '@prisma/client';

export interface GameRepository {
  findAll: () => Promise<Game[]>;
  saveGames?: (games: Game[]) => Promise<void>;
  findById: (id: string) => Promise<Game | null>;
}

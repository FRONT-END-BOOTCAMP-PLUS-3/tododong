import { Game } from '@prisma/client';

export interface GameRepository {
  findAll: () => Promise<Game[]>;
  findById: (id: string) => Promise<Game | null>;
  saveGames?: (games: Game[]) => Promise<void>;
}

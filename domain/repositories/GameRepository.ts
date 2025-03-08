import { Game } from '@prisma/client';

export interface ReadonlyGameRepository {
  findAll: () => Promise<Game[]>;
}

export interface GameRepository extends ReadonlyGameRepository {
  findById: (id: string) => Promise<Game | null>;
  saveGames: (games: Game[]) => Promise<void>;
}

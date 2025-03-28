import { Game } from '@prisma/client';

export interface GameRepository {
  findById: (id: string) => Promise<Game | null>;
  findByDate: (date: string) => Promise<Game[]>;
  countByDate: () => Promise<{ date: string; gameCount: number }[]>;
  saveGames: (games: Game[]) => Promise<void>;
  updateTodayGames: (games: Game[]) => Promise<void>;
}

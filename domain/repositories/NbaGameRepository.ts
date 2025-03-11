import { Game } from '@prisma/client';

export interface NbaGameRepository {
  findAll: () => Promise<Game[]>;
  findTodayGame: () => Promise<Game[]>;
}

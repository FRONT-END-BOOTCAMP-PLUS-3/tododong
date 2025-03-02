import { games } from '@prisma/client';

export interface GameRepository {
  findAll: () => Promise<games[]>;
}

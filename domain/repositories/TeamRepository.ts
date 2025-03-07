import { Team } from '@prisma/client';

export interface TeamRepository {
  findById: (id: string) => Promise<Team | null>;
}

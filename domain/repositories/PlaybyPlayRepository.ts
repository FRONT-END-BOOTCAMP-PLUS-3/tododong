import { Playbyplay } from '../entities/Playbyplay';

export interface PlaybyplayRepository {
  findById(id: string): Promise<Playbyplay[]>;
}

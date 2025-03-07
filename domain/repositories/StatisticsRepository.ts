import { Statistics } from '../entities/Statistics';

export interface StatisticsRepository {
  findById(id: string): Promise<Statistics[]>;
}

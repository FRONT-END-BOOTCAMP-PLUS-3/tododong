import { User } from '@prisma/client';

export default interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
}

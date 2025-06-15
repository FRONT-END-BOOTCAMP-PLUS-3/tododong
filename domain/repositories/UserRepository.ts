import { User } from '@prisma/client';

export default interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  findByNickname(nickname: string): Promise<User | null>;
  createOne(userInfo: Partial<User>): Promise<void>;
  updateOne(userInfo: Partial<User>): Promise<User>;
}

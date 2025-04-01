import { User } from '@prisma/client';

export interface ModifyUserDto extends Partial<User> {
  id: string;
}

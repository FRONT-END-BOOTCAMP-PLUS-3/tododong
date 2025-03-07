import { VerificationCode } from '@prisma/client';

export interface VerificationCodeRepository {
  deleteDuplication(email: string): Promise<void>;
  createOne({ email, code }: { email: string; code: string }): Promise<void>;
  findByEmail(email: string): Promise<VerificationCode | null>;
}

import { VerificationCode } from '@prisma/client';

export interface VerificationCodeRepository {
  deleteDuplication(email: string): Promise<void>;
  createOne(verificationCode: Partial<VerificationCode>): Promise<void>;
  findByEmail(email: string): Promise<VerificationCode | null>;
}

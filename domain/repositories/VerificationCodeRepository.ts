export interface VerificationCodeRepository {
  deleteDuplication(email: string): Promise<void>;
  createOne({ email, code }: { email: string; code: string }): Promise<void>;
}

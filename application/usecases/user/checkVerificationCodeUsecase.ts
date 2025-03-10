import { VerificationCodeRepository } from '@/domain/repositories/VerificationCodeRepository';
import CheckVerificationCodeDto from './dto/CheckVerificationCodeDto';

export const checkVerificationCodeUsecase = async (
  verificationCodeRepository: VerificationCodeRepository,
  dto: CheckVerificationCodeDto
) => {
  const verificationCode = await verificationCodeRepository.findByEmail(
    dto.email
  );
  if (!verificationCode) return null;

  if (dto.code === verificationCode.code) {
    const now = new Date();
    const expiresAt = verificationCode.expiresAt;

    return expiresAt.getTime() >= now.getTime();
  } else return false;
};

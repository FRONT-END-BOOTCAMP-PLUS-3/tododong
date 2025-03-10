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

  if (dto.code === verificationCode.code) return true;
  else return false;
};

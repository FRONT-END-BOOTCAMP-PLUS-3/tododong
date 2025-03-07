import { VerificationCodeRepository } from '@/domain/repositories/VerificationCodeRepository';
import checkVerificationCodeDto from './dto/checkVerificationCodeDto';

export const checkVerificationCodeUsecase = async (
  verificationCodeRepository: VerificationCodeRepository,
  dto: checkVerificationCodeDto
) => {
  const verificationCode = await verificationCodeRepository.findByEmail(
    dto.email
  );
  if (!verificationCode) return null;

  if (dto.code === verificationCode.code) return true;
  else return false;
};

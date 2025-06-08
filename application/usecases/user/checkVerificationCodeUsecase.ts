import { VerificationCodeRepository } from '@/domain/repositories/VerificationCodeRepository';
import CheckVerificationCodeDto from './dto/CheckVerificationCodeDto';
import UserRepository from '@/domain/repositories/UserRepository';

export const checkVerificationCodeUsecase = async (
  userRepository: UserRepository,
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

    if (expiresAt.getTime() >= now.getTime()) {
      const user = await userRepository.findByEmail(dto.email);

      if (user && user.deletedAt) {
        throw new Error('30일 이내에 탈퇴한 이메일입니다.');
      }

      return true;
    }
  } else return false;
};

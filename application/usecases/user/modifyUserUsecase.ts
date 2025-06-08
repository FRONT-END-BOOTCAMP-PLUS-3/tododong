import UserRepository from '@/domain/repositories/UserRepository';
import { generateAccessToken } from '@/utils/auth';
import { ModifyUserDto } from './dto/ModifyUserDto';

export const modifyUserUsecase = async (
  userRepository: UserRepository,
  userInfo: ModifyUserDto
): Promise<{ accessToken: string }> => {
  const updatedUser = await userRepository.updateOne(userInfo);

  // JWT 페이로드 구성 (필요한 정보만 포함)
  const accessPayload = {
    id: updatedUser.id,
    nickname: updatedUser.nickname,
    email: updatedUser.email,
    createdAt: updatedUser.createdAt,
    updatedAt: updatedUser.updatedAt,
  };

  // 비밀 키는 환경 변수로 관리 (process.env.ACCESS_SECRET)
  // 토큰 유효기간은 1시간으로 설정 (필요에 따라 조정)
  const accessToken = await generateAccessToken(accessPayload);

  return { accessToken };
};

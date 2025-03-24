import UserRepository from '@/domain/repositories/UserRepository';
import { generateAccessToken } from '@/utils/auth';
import bcryptjs from 'bcryptjs';
import LoginUserDto from './dto/LoginUserDto';

export const loginUsecase = async (
  userRepository: UserRepository,
  dto: LoginUserDto
): Promise<{ accessToken: string }> => {
  const { email, password } = dto;

  // 1. 회원데이터를 조회
  const user = await userRepository.findByEmail(email);
  // 1-1. 회원이 없을 때 오류 반환
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // 2. 비밀번호 검증
  const isValidPassword = await bcryptjs.compare(password, user.password);
  // 2-1. 비밀번호가 일치하지 않을 때 오류 반환
  if (!isValidPassword) {
    throw new Error('Invalid email or password');
  }

  // JWT 페이로드 구성 (필요한 정보만 포함)
  const accessPayload = {
    id: user.id,
    nickname: user.nickname,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  // 비밀 키는 환경 변수로 관리 (process.env.ACCESS_SECRET)
  // 토큰 유효기간은 1시간으로 설정 (필요에 따라 조정)
  const accessToken = await generateAccessToken(accessPayload);

  return { accessToken };
};

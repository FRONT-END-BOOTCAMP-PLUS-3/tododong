import UserRepository from '@/domain/repositories/UserRepository';
import bcryptjs from 'bcryptjs';
import { SignupUserDto } from './dto/SignupUserDto';

export const signupUsecase = async (
  userRepository: UserRepository,
  dto: SignupUserDto
): Promise<void> => {
  const { email, password, nickname } = dto;

  const user = await userRepository.findByNickname(nickname);
  if (user) {
    throw new Error('닉네임 중복');
  }

  const encryptedPassword = await bcryptjs.hash(password, 10);

  await userRepository.createOne({
    email,
    password: encryptedPassword,
    nickname,
  });
};

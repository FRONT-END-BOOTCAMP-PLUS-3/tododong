import UserRepository from '@/domain/repositories/UserRepository';
import bcryptjs from 'bcryptjs';
import { SignupUserDto } from './dto/SignupUserDto';

export const signupUsecase = async (
  userRepository: UserRepository,
  dto: SignupUserDto
): Promise<void> => {
  const { email, password, nickname } = dto;

  const emailDuplicatedUser = await userRepository.findByEmail(email);
  if (emailDuplicatedUser) {
    throw new Error('이메일 중복');
  }

  const nicknameDuplicatedUser = await userRepository.findByNickname(nickname);
  if (nicknameDuplicatedUser) {
    throw new Error('닉네임 중복');
  }

  const encryptedPassword = await bcryptjs.hash(password, 10);

  await userRepository.createOne({
    email,
    password: encryptedPassword,
    nickname,
  });
};

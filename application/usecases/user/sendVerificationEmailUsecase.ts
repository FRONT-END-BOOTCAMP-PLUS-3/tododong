import UserRepository from '@/domain/repositories/UserRepository';
import { VerificationCodeRepository } from '@/domain/repositories/VerificationCodeRepository';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmailUsecase = async (
  verificationCodeRepository: VerificationCodeRepository,
  userRepository: UserRepository,
  email: string
) => {
  try {
    const user = await userRepository.findByEmail(email);
    if (user) throw new Error('이메일 중복');

    await verificationCodeRepository.deleteDuplication(email);

    const code = Math.random().toString(36).substring(2, 8);

    await verificationCodeRepository.createOne({ email, code });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: '[토도동] 회원가입 인증 코드',
      text: `인증 코드: ${code} (2분 내 입력해주세요)`,
    });
  } catch (err) {
    throw err;
  }
};

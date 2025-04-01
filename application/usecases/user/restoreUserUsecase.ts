import UserRepository from '@/domain/repositories/UserRepository';
import { transporter } from '@/utils/transporter';
import bcryptjs from 'bcryptjs';

export const restoreUserUsecase = async (
  userRepository: UserRepository,
  email: string
) => {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new Error('해당 이메일로 가입된 유저가 없습니다.');
  }
  if (!user.deletedAt) {
    throw new Error('삭제된 유저가 아닙니다.');
  }

  const randomPassword = generateRandomPassword(
    Math.floor(Math.random() * (20 - 8 + 1)) + 8 // 8 ~ 20자 랜덤
  );

  const encryptedPassword = await bcryptjs.hash(randomPassword, 10);

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: '[토도동] 임시 비밀번호',
    html: `
      <div style="text-align: center; width: 100%; max-width: 480px; padding: 24px; background-color: #333">
        <img src="https://tododong.com/_next/image?url=%2Flogo.png&w=384&q=75" alt="토도동" width="140" height="89" style="margin-bottom: 24px" />
        <div style="width: 80%; max-width: 400px; margin-inline: auto; padding: 12px; background-color: #2a2a2a; color: white;">
          <h1 style="margin-bottom: 12px; font-size: 28px">임시 비밀번호</h1>
          <p style="margin: 0 0 8px 0; white-space: pre-wrap">회원님의 계정이 복구되어 임시 비밀번호를 보내드립니다.\n아래의 비밀번호를 입력해주세요</p>
          <strong style="font-size: 28px; color: #fa812f">${randomPassword}</strong>
          <p style="color: #999999; margin: 8px">(2분 내 입력해주세요)</p>
        </div>
      </div>
    `,
  });

  await userRepository.updateOne({
    id: user.id,
    password: encryptedPassword,
    deletedAt: null,
  });
};

function generateRandomPassword(length: number): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const specialChars = '!@#$%^&*+?';
  const allChars = letters + numbers + specialChars;

  let result = '';
  result += letters.charAt(Math.floor(Math.random() * letters.length));
  result += numbers.charAt(Math.floor(Math.random() * numbers.length));
  result += specialChars.charAt(
    Math.floor(Math.random() * specialChars.length)
  );

  for (let i = 3; i < length; i++) {
    result += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }

  return result
    .split('')
    .sort(() => 0.5 - Math.random()) // 랜덤 순서로 섞기
    .join('');
}

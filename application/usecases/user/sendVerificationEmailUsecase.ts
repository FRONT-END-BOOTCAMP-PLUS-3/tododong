import UserRepository from '@/domain/repositories/UserRepository';
import { VerificationCodeRepository } from '@/domain/repositories/VerificationCodeRepository';
import { transporter } from '@/utils/transporter';

export const sendVerificationEmailUsecase = async (
  verificationCodeRepository: VerificationCodeRepository,
  userRepository: UserRepository,
  email: string
) => {
  try {
    const user = await userRepository.findByEmail(email);
    if (user && !user.deletedAt) {
      throw new Error('이메일 중복');
    }

    await verificationCodeRepository.deleteDuplication(email);

    const code = Math.random().toString(36).substring(2, 8);

    await verificationCodeRepository.createOne({
      email,
      code,
      expiresAt: new Date(Date.now() + 2 * 60 * 1000),
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: '[토도동] 회원가입 인증 코드',
      // text: `인증 코드: ${code} (2분 내 입력해주세요)`,
      html: `
        <div style="text-align: center; width: 100%; max-width: 480px; padding: 24px; background-color: #333">
          <img src="https://tododong.com/_next/image?url=%2Flogo.png&w=384&q=75" alt="토도동" width="140" height="89" style="margin-bottom: 24px" />
          <div style="width: 80%; max-width: 400px; margin-inline: auto; padding: 12px; background-color: #2a2a2a; color: white;">
            <h1 style="margin-bottom: 12px; font-size: 28px">회원가입 인증 코드</h1>
            <p style="margin: 0 0 8px 0">아래의 인증 코드를 입력해주세요.</p>
            <strong style="font-size: 28px; color: #fa812f">${code}</strong>
            <p style="color: #999999; margin: 8px">(2분 내 입력해주세요)</p>
          </div>
        </div>
      `,
    });
  } catch (err) {
    throw err;
  }
};

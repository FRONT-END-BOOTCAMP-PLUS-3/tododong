import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import Image from 'next/image';
import Icon from '../icon/Icon';
import styles from './Footer.module.scss';
import LogoutButton from './LogoutButton';

interface UserDto {
  email: string;
  nickname: string;
}
interface JwtPayloadIwthUserDto extends jwt.JwtPayload, UserDto {}

const Footer = async ({ pathname }: { pathname: string }) => {
  const hideHeaderRoutes = ['/login', '/signup'];
  if (hideHeaderRoutes.includes(pathname)) return null;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  let userInfo;
  if (accessToken) {
    userInfo = jwt.verify(
      accessToken,
      process.env.JWT_SECRET as string
    ) as JwtPayloadIwthUserDto;
  }

  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <Image
            src="/logo_footer.png"
            width={65}
            height={51}
            alt="footer 로고"
          />
          <div>
            <address>
              상호명: 토도동 | 대표: 김승수 | 이메일: tododong@gmail.com
              <br />
              주소: 서울 중구 퇴계로 324, 성우빌딩 10층
            </address>
            <p>© tododong. All rights reserved.</p>
          </div>
          <ul className={styles.termWrapper}>
            <li>
              {userInfo ? (
                <LogoutButton />
              ) : (
                <a href="/login" className={styles.loginLink}>
                  로그인
                </a>
              )}
            </li>
            <li>
              <a href="">이용약관</a>
            </li>
            <li>
              <a href="">광고문의</a>
            </li>
            <li>
              <a href="">개인정보처리방침</a>
            </li>
            <li>
              <a href="">공지사항</a>
            </li>
          </ul>
          <ul className={styles.socialList}>
            <li>
              <a href="">
                <Icon id="facebook" width={24} color="#000" />
              </a>
            </li>
            <li>
              <a href="">
                <Icon id="instagram" width={24} color="#000" />
              </a>
            </li>
            <li>
              <a href="https://github.com/FRONT-END-BOOTCAMP-PLUS-3/tododong/tree/main">
                <Icon id="github" width={24} color="#000" />
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </>
  );
};

export default Footer;

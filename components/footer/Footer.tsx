import { verifyToken } from '@/utils/auth';
import { cookies } from 'next/headers';
import Image from 'next/image';
import Icon from '../icon/Icon';
import styles from './Footer.module.scss';
import LogoutButton from './LogoutButton';
import ReturnUrlLink from '../action-link/ReturnUrlLink';

const Footer = async ({ pathname }: { pathname: string }) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value || '';

  let userInfo;

  if (accessToken) {
    const decoded = await verifyToken(accessToken);

    userInfo = decoded;
  }

  return (
    <>
      <footer className={styles.footer}>
        <Image src="/logo_sm.png" width={65} height={51} alt="footer 로고" />

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
              <ReturnUrlLink
                href="/login"
                pathname={pathname}
                className={styles.loginLink}
              >
                로그인
              </ReturnUrlLink>
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
              <Icon id="facebook" width={24} />
            </a>
          </li>
          <li>
            <a href="">
              <Icon id="instagram" width={24} />
            </a>
          </li>
          <li>
            <a href="https://github.com/FRONT-END-BOOTCAMP-PLUS-3/tododong/tree/main">
              <Icon id="github" width={24} />
            </a>
          </li>
        </ul>
      </footer>
    </>
  );
};

export default Footer;

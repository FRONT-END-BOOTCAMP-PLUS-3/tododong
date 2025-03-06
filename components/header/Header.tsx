import { verifyToken } from '@/utils/auth';
import { JWTPayload } from 'jose';
import { cookies } from 'next/headers';
import Image from 'next/image';
import styles from './Header.module.scss';
import UserDropDown from './UserDropDown';

interface UserInfo {
  email: string;
  nickname: string;
}
interface JWTPayloadIwthUserInfo extends JWTPayload, UserInfo {}

const Header = async ({ pathname }: { pathname: string }) => {
  const hideHeaderRoutes = ['/login', '/signup'];
  if (hideHeaderRoutes.includes(pathname)) return null;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value || '';

  let userInfo;

  if (accessToken) {
    const decoded = (await verifyToken(
      accessToken
    )) as JWTPayloadIwthUserInfo | null;

    userInfo = decoded;
  }

  return (
    <>
      <header className={styles.header}>
        <a href="/" aria-label="홈으로 이동">
          <Image src="/logo_sm.png" alt="" width={76} height={60} priority />
        </a>

        {userInfo ? (
          <UserDropDown userInfo={userInfo} />
        ) : (
          <a href="/login" className={styles.loginBtn}>
            로그인
          </a>
        )}
      </header>

      <div className={styles.spacer}></div>
    </>
  );
};

export default Header;

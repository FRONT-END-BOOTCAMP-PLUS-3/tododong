import { UserInfo } from '@/types/user-info';
import { verifyToken } from '@/utils/auth';
import { JWTPayload } from 'jose';
import { cookies } from 'next/headers';
import Image from 'next/image';
import ReturnUrlLink from '../action-link/ReturnUrlLink';
import styles from './Header.module.scss';
import UserDropDown from './UserDropDown';

interface JWTPayloadIwthUserInfo extends JWTPayload, UserInfo {}

const Header = async ({ pathname }: { pathname: string }) => {
  const hideHeaderRoutes = ['/login', '/signup'];
  if (hideHeaderRoutes.includes(pathname)) return null;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value || '';

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
          <ReturnUrlLink
            href="/login"
            pathname={pathname}
            className={styles.loginBtn}
          >
            로그인
          </ReturnUrlLink>
        )}
      </header>

      <div className={styles.spacer}></div>
    </>
  );
};

export default Header;

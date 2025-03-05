import { headers } from 'next/headers';
import Image from 'next/image';
import styles from './Header.module.scss';
import UserDropDown from './UserDropDown';

const Header = async ({ pathname }: { pathname: string }) => {
  const hideHeaderRoutes = ['/login', '/signup'];
  if (hideHeaderRoutes.includes(pathname)) return null;

  const headersList = await headers();
  const userInfoHeader = headersList.get('x-user-info');
  const userInfo = userInfoHeader
    ? JSON.parse(Buffer.from(userInfoHeader, 'base64').toString('utf-8'))
    : null;

  return (
    <>
      <header className={styles.header}>
        <a href="/" aria-label="홈으로 이동">
          <Image
            src="/logo_header.png"
            alt=""
            width={76}
            height={60}
            priority
          />
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

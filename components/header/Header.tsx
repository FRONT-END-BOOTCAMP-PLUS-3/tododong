import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import Image from 'next/image';
import styles from './Header.module.scss';
import UserDropDown from './UserDropDown';

interface UserDto {
  email: string;
  nickname: string;
}

interface JwtPayloadIwthUserDto extends jwt.JwtPayload, UserDto {}

const Header = async ({ pathname }: { pathname: string }) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  let userInfo;
  if (accessToken) {
    userInfo = jwt.verify(
      accessToken,
      process.env.JWT_SECRET as string
    ) as JwtPayloadIwthUserDto;
  }

  // 로그인, 회원가입 페이지에서는 header 렌더링 X
  const hideHeaderRoutes = ['/login', '/signup'];
  if (hideHeaderRoutes.includes(pathname)) return null;

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

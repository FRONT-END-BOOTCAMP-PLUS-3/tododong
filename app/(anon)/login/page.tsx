import Image from 'next/image';
import LoginForm from './components/LoginForm';
import styles from './page.module.scss';

export const metadata = {
  title: '로그인 - 토도동',
  description: '토도동에 로그인하고 다양한 서비스를 이용해 보세요.',
};

const Login = () => {
  return (
    <main className={styles.page}>
      <h1 className="srOnly">로그인</h1>

      <a href="/" aria-label="홈으로 이동" className={styles.homeLink}>
        <Image src="/logo.png" alt="" width={140} height={89} priority />
      </a>

      <LoginForm />

      <div className={styles.linksWrapper}>
        <a href="#" aria-label="아이디 찾기">
          아이디 찾기
        </a>
        <span aria-hidden="true">|</span>
        <a href="#" aria-label="비밀번호 찾기">
          비밀번호 찾기
        </a>
      </div>

      <div className={styles.divider} />

      <p>
        토도동 회원이 아닌가요?
        <a
          href="/signup"
          aria-label="회원 가입 페이지로 이동"
          className={styles.signupLink}
        >
          지금 가입하세요
        </a>
      </p>
    </main>
  );
};

export default Login;

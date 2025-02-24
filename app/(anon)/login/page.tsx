import Image from 'next/image';
import Link from 'next/link';
import LoginForm from './components/LoginForm';
import styles from './page.module.scss';

const Login = () => {
  return (
    <main className={styles.page}>
      <h1 className="srOnly">로그인</h1>

      <Link href="/" aria-label="홈으로 이동" className={styles.homeLink}>
        <Image src="/logo.png" alt="" width={140} height={89} priority />
      </Link>

      <LoginForm />

      <div className={styles.linksWrapper}>
        <Link href="#" aria-label="아이디 찾기">
          아이디 찾기
        </Link>
        <span aria-hidden="true">|</span>
        <Link href="#" aria-label="비밀번호 찾기">
          비밀번호 찾기
        </Link>
      </div>

      <div className={styles.divider} />

      <p>
        토도동 회원이 아닌가요?
        <Link
          href="/signup"
          aria-label="회원 가입 페이지로 이동"
          className={styles.signupLink}
        >
          지금 가입하세요
        </Link>
      </p>
    </main>
  );
};

export default Login;

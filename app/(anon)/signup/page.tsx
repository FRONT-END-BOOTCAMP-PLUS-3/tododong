import Image from 'next/image';
import Link from 'next/link';
import SignupForm from './components/SignupForm';
import styles from './page.module.scss';

const SignUp = () => {
  return (
    <main className={styles.page}>
      <h1 className="srOnly">회원가입</h1>

      <Link href="/" aria-label="홈으로 이동" className={styles.logo}>
        <Image src="/logo.png" alt="" width={140} height={89} priority />
      </Link>

      <SignupForm />

      <p>
        이미 아이디가 있으신가요?
        <Link href="/login" className={styles.loginLink}>
          로그인
        </Link>
      </p>
    </main>
  );
};

export default SignUp;

import Image from 'next/image';
import SignupForm from './components/SignupForm';
import styles from './page.module.scss';

export const metadata = {
  title: '회원가입 - 토도동',
  description: '아직 토도동 회원이 아니신가요? 지금 가입하세요.',
};

const SignUp = () => {
  return (
    <main className={styles.page}>
      <h1 className="srOnly">회원가입</h1>

      <a href="/" aria-label="홈으로 이동" className={styles.logo}>
        <Image src="/logo.png" alt="" width={140} height={89} priority />
      </a>

      <SignupForm />

      <p>
        이미 아이디가 있으신가요?
        <a href="/login" className={styles.loginLink}>
          로그인
        </a>
      </p>
    </main>
  );
};

export default SignUp;

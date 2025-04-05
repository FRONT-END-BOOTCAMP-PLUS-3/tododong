import Image from 'next/image';
import styles from './not-found.module.scss';
import Link from 'next/link';

export default async function NotFound() {
  return (
    <main className={styles.page}>
      <Link href="/" aria-label="홈으로 이동" className={styles.homeLink}>
        <Image src="/logo.png" alt="" width={140} height={89} priority />
      </Link>

      <div className={styles.contents}>
        <h1 className={styles.title}>404 ERROR</h1>
        <p>페이지를 찾을 수 없습니다.</p>
        <div>
          <p>페이지가 존재하지 않거나, 사용할 수 없는 페이지입니다.</p>
          <p>입력하신 주소가 정확한지 다시 한 번 확인해 주세요.</p>
        </div>
      </div>

      <Link href={'/'} className={styles.homeButton}>
        홈으로 이동하기
      </Link>
    </main>
  );
}

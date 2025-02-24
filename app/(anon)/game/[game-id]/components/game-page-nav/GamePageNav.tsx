'use client';

import styles from './GamePageNav.module.scss';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const GamePageNav = ({ gameId }: { gameId: string }) => {
  const pathname = usePathname();

  return (
    <nav className={styles.navContainer}>
      <Link
        href={`/game/${gameId}/videos`}
        className={`${styles.link} ${
          pathname === `/game/${gameId}/videos` ? styles.active : ''
        }`}
      >
        영상
      </Link>
      <Link
        href={`/game/${gameId}/box-score`}
        className={`${styles.link} ${
          pathname === `/game/${gameId}/box-score` ? styles.active : ''
        }`}
      >
        선수 기록
      </Link>
      <Link
        href={`/game/${gameId}/play-by-play`}
        className={`${styles.link} ${
          pathname === `/game/${gameId}/play-by-play` ? styles.active : ''
        }`}
      >
        실시간 중계
      </Link>
    </nav>
  );
};

export default GamePageNav;

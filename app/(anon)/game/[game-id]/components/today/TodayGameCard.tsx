import GameStatusTag from '@/components/game-status-tag/GameStatusTag';
import GameStatus from '@/types/game-status';
import Image from 'next/image';
import Link from 'next/link';
import styles from './TodayGameCard.module.scss';

type TodayGameCardProps = {
  gameId: string;
  gameStatus: GameStatus;
  startTime: { date: string; time: string };
  teams: {
    homeTeam: { name: string; logoSrc: string; score: number };
    awayTeam: { name: string; logoSrc: string; score: number };
  };
};

const TodayGameCard = ({
  gameId,
  gameStatus,
  startTime,
  teams,
}: TodayGameCardProps) => {
  if (!gameId)
    return (
      <article className={styles.nodata}>
        <div>no data</div>
      </article>
    );

  const getTime = (startTime: string) => {
    return startTime.split(' ')[0]; // '09:00' 추출
  };

  return (
    <article className={styles.container}>
      <Link href={`/game/${gameId}/videos`}>
        <div className={styles.gameStatus}>
          <span>{getTime(startTime.time)}</span>
          <GameStatusTag size="sm" status={gameStatus} />
        </div>
        <div className={styles.teamStatus}>
          <div>
            <Image
              width={20}
              height={20}
              src={teams.awayTeam.logoSrc}
              alt={teams.awayTeam.name}
            />
            <span className="srOnly">팀 이름:</span>
            <span>{teams.awayTeam.name}</span>
          </div>
          <span className="srOnly">점수:</span>
          <span>{teams.awayTeam.score}</span>
        </div>
        <div className={styles.teamStatus}>
          <div>
            <Image
              width={24}
              height={24}
              src={teams.homeTeam.logoSrc}
              alt={teams.homeTeam.name}
            />
            <span className="srOnly">팀 이름:</span>
            <span>{teams.homeTeam.name}</span>
          </div>
          <span className="srOnly">점수:</span>
          <span>{teams.homeTeam.score}</span>
        </div>
      </Link>
    </article>
  );
};

export default TodayGameCard;

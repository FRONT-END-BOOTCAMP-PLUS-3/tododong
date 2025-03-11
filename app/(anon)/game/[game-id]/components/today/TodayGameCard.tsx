import Image from 'next/image';
import GameStatusTag from '@/components/game-status-tag/GameStatusTag';
import styles from './TodayGameCard.module.scss';
import Link from 'next/link';
import GameStatus from '@/types/game-status';

type TodayGameCardProps = {
  data: {
    id: string;
    game: {
      startTime: string;
      status: GameStatus;
    };
    home: {
      nickname: string;
      logo: string;
      points: number;
    };
    away: {
      nickname: string;
      logo: string;
      points: number;
    };
  };
};

const TodayGameCard = ({ data }: TodayGameCardProps) => {
  if (data === null)
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
      <Link href={`/game/${data.id}/videos`}>
        <div className={styles.gameStatus}>
          <span>{getTime(data.game.startTime)}</span>
          <GameStatusTag size="sm" status={data.game.status} />
        </div>
        <div className={styles.teamStatus}>
          <div>
            <Image
              width={24}
              height={24}
              src={data.away.logo}
              alt={data.away.nickname}
            />
            <span className="srOnly">팀 이름:</span>
            <span>{data.away.nickname}</span>
          </div>
          <span className="srOnly">점수:</span>
          <span>{data.away.points}</span>
        </div>
        <div className={styles.teamStatus}>
          <div>
            <Image
              width={24}
              height={24}
              src={data.home.logo}
              alt={data.home.nickname}
            />
            <span className="srOnly">팀 이름:</span>
            <span>{data.home.nickname}</span>
          </div>
          <span className="srOnly">점수:</span>
          <span>{data.home.points}</span>
        </div>
      </Link>
    </article>
  );
};

export default TodayGameCard;

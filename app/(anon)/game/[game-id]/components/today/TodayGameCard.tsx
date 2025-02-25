import GameStatusTag from '@/components/game-status-tag/GameStatusTag';
import styles from './TodayGameCard.module.scss';

const TodayGameCard = ({ data }) => {
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
      <div className={styles.gameStatus}>
        <span>{getTime(data.game.startTime)}</span>
        <GameStatusTag size="sm" status={data.game.status} />
      </div>
      <div className={styles.teamStatus}>
        <div>
          <div className={styles.logo}>
            <img src={data.away.logo} alt={data.away.nickname} />
          </div>
          <p>{data.away.nickname}</p>
        </div>
        <p>{data.away.points}</p>
      </div>
      <div className={styles.teamStatus}>
        <div>
          <div className={styles.logo}>
            <img src={data.home.logo} alt={data.home.nickname} />
          </div>
          <p>{data.home.nickname}</p>
        </div>
        <p>{data.home.points}</p>
      </div>
    </article>
  );
};

export default TodayGameCard;

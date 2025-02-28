import styles from './GameCard.module.scss';
import GameStatus from '@/types/game-status';
import Link from 'next/link';
import GameStatusTag from '@/components/game-status-tag/GameStatusTag';
import Team from '@/components/team/Team';

type GameCardProps = {
  gameId: string;
  gameStatus: GameStatus;
  startTime: { date: string; time: string };
  teams: {
    homeTeam: { nickname: string; logoSrc: string; score: number };
    awayTeam: { nickname: string; logoSrc: string; score: number };
  };
};

const GameCard = ({ gameId, gameStatus, startTime, teams }: GameCardProps) => {
  return (
    <article className={styles.card}>
      <div className={styles.game}>
        <Team logoSrc={teams.awayTeam.logoSrc} name={teams.awayTeam.nickname} />
        <div className={styles.status}>
          {gameStatus === 'scheduled' ? (
            <p>
              <span className={styles.date}>{startTime.date}</span>
              <span className={styles.time}>{startTime.time}</span>
            </p>
          ) : (
            <>
              <p>{teams.awayTeam.score}</p>
              <GameStatusTag size="lg" status={gameStatus} />
              <p>{teams.homeTeam.score}</p>
            </>
          )}
        </div>
        <Team logoSrc={teams.homeTeam.logoSrc} name={teams.homeTeam.nickname} />
      </div>
      <div className={styles.links}>
        <Link href={`/game/${gameId}/videos`}>영상</Link>
        <Link href={`/game/${gameId}/box-score`}>선수 기록</Link>
        <Link href={`/game/${gameId}/play-by-play`}>실시간 중계</Link>
      </div>
    </article>
  );
};

export default GameCard;

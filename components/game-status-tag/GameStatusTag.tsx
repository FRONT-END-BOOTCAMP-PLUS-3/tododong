import styles from './GameStatusTag.module.scss';
import GameStatus from '@/types/game-status';

type GameStatusTagProps = {
  size: 'sm' | 'lg';
  status: GameStatus;
};

const statusTextMap = {
  live: 'LIVE',
  final: '종료',
  scheduled: '예정',
};

const GameStatusTag = ({ size, status }: GameStatusTagProps) => {
  return (
    <div className={`${styles.tag} ${styles[size]} ${styles[status]}`}>
      {statusTextMap[status]}
    </div>
  );
};

export default GameStatusTag;

/*
사용 예시 1
<GameStatusTag size="sm" status="scheduled" />

사용 예시 2
<GameStatusTag size="lg" status="live" />
*/

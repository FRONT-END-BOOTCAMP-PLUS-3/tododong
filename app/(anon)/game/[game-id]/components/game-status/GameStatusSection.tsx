import GameStatusTag from '@/components/game-status-tag/GameStatusTag';
import styles from './GameStatusSection.module.scss';
import Team from '@/components/team/Team';
import { GameDetailDto } from '@/application/usecases/game/game-detail/dto/gameDetailDto';

const GameStatusSection = ({ gameInfo }: { gameInfo: GameDetailDto }) => {
  return (
    <section className={styles.container}>
      <div className={styles.teamWrap}>
        <Team
          logoSrc={gameInfo.teams.awayTeam.logoSrc}
          name={gameInfo.teams.awayTeam.name}
        />
      </div>
      {gameInfo.gameStatus === 'scheduled' ? (
        <div className={styles.matchScheduled}>
          <p aria-label="경기장">{gameInfo.arenaName}</p>
          <p aria-label="경기 시작일">{gameInfo.startTime.date}</p>
          <p aria-label="경기 시작 시간">{gameInfo.startTime.time}</p>
        </div>
      ) : (
        <div>
          <div className={styles.matchStatus}>
            {/* date.start가 현재 일시와 동일하거나 그 이상이면 'live', 이전이면 '예정' end보다 이후면 '종료',*/}
            <p aria-label="어웨이팀 점수">{gameInfo.teams.awayTeam.score}</p>
            <GameStatusTag size="lg" status={gameInfo.gameStatus} />
            <p aria-label="홈팀 점수">{gameInfo.teams.homeTeam.score}</p>
          </div>
          <table className={styles.matchTable}>
            <thead>
              <tr>
                <th scope="col">팀</th>
                <th scope="col">1Q</th>
                <th scope="col">2Q</th>
                <th scope="col">3Q</th>
                <th scope="col">4Q</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{gameInfo.teams.awayTeam.name}</td>
                {gameInfo.teams.awayTeam.periods.map((score, index) => (
                  <td key={index}>{score || '-'}</td>
                ))}
              </tr>
              <tr>
                <td>{gameInfo.teams.homeTeam.name}</td>
                {gameInfo.teams.homeTeam.periods.map((score, index) => (
                  <td key={index}>{score || '-'}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <div className={styles.teamWrap}>
        <Team
          logoSrc={gameInfo.teams.homeTeam.logoSrc}
          name={gameInfo.teams.homeTeam.name}
        />
      </div>
    </section>
  );
};

export default GameStatusSection;

import GameStatusTag from '@/components/game-status-tag/GameStatusTag';
import styles from './GameStatusSection.module.scss';
import Team from '@/components/team/Team';
import GameStatus from '@/types/game-status';

const dto = {
  id: 14903,
  game: {
    startDate: '2024.02.25',
    startTime: '10:00 AM KST',
    arena: 'Wells Fargo Center',
    status: 'scheduled',
  },
  home: {
    name: 'Chicago Bulls',
    code: 'CHI',
    logo: 'https://upload.wikimedia.org/wikipedia/fr/thumb/d/d1/Bulls_de_Chicago_logo.svg/1200px-Bulls_de_Chicago_logo.svg.png',
    linescore: ['21', '35', '', ''],
    points: 56,
  },
  away: {
    name: 'Atlanta Hawks',
    nickname: 'Hawks',
    code: 'ATL',
    logo: 'https://upload.wikimedia.org/wikipedia/fr/e/ee/Hawks_2016.png',
    linescore: ['33', '23', '', ''],
    points: 56,
  },
};
const GameStatusSection = () => {
  return (
    <section className={styles.container}>
      <div className={styles.teamWrap}>
        <Team logoSrc={dto.away.logo} name={dto.away.code} />
      </div>
      {dto.game.status === 'scheduled' ? (
        <div className={styles.matchScheduled}>
          <p aria-label="경기장">{dto.game.arena}</p>
          <p aria-label="경기 시작일">{dto.game.startDate}</p>
          <p aria-label="경기 시작 시간">{dto.game.startTime}</p>
        </div>
      ) : (
        <div>
          <div className={styles.matchStatus}>
            {/* date.start가 현재 일시와 동일하거나 그 이상이면 'live', 이전이면 '예정' end보다 이후면 '종료',*/}
            <p aria-label="어웨이팀 점수">{dto.away.points}</p>
            <GameStatusTag size="lg" status={dto.game.status as GameStatus} />
            <p aria-label="홈팀 점수">{dto.home.points}</p>
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
                <td>{dto.away.name}</td>
                {dto.away.linescore.map((score, index) => (
                  <td key={index}>{score || '-'}</td>
                ))}
              </tr>
              <tr>
                <td>{dto.home.name}</td>
                {dto.home.linescore.map((score, index) => (
                  <td key={index}>{score || '-'}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <div className={styles.teamWrap}>
        <Team logoSrc={dto.home.logo} name={dto.home.code} />
      </div>
    </section>
  );
};

export default GameStatusSection;

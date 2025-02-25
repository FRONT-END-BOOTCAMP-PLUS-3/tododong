import GameStatusTag from '@/components/game-status-tag/GameStatusTag';
import styles from './GameStatusSection.module.scss';
import Team from '@/components/team/Team';

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
          <p>{dto.game.arena}</p>
          <p>{dto.game.startDate}</p>
          <p>{dto.game.startTime}</p>
        </div>
      ) : (
        <div>
          <div className={styles.matchStatus}>
            {/* date.start가 현재 일시와 동일하거나 그 이상이면 'live', 이전이면 '예정' end보다 이후면 '종료',*/}
            <p>{dto.away.points}</p>
            <GameStatusTag size="lg" status={dto.game.status} />
            <p>{dto.home.points}</p>
          </div>
          <table className={styles.matchTable}>
            <thead>
              <tr>
                <th>팀</th>
                <th>1Q</th>
                <th>2Q</th>
                <th>3Q</th>
                <th>4Q</th>
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

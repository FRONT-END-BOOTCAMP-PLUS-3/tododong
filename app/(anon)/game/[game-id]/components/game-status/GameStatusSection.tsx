import GameStatusTag from '@/components/game-status-tag/GameStatusTag';
import styles from './GameStatusSection.module.scss';
import Team from '@/components/team/Team';

const GameData = [
  {
    id: 14902,
    date: {
      start: '2025-02-21T00:00:00.000Z',
      end: null,
    },
    teams: {
      visitors: {
        id: 19,
        name: 'Memphis Grizzlies',
        code: 'MEM',
        logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f1/Memphis_Grizzlies.svg/1200px-Memphis_Grizzlies.svg.png',
      },
      home: {
        id: 15,
        name: 'Indiana Pacers',
        code: 'IND',
        logo: 'https://upload.wikimedia.org/wikipedia/fr/thumb/c/cf/Pacers_de_l%27Indiana_logo.svg/1180px-Pacers_de_l%27Indiana_logo.svg.png',
      },
    },
    scores: {
      visitors: {
        linescore: ['33', '26', '23', ''],
        points: 82,
      },
      home: {
        linescore: ['28', '50', '13', ''],
        points: 91,
      },
    },
  },
];

const GameStatusSection = () => {
  const data = GameData[0];
  return (
    <section className={styles.container}>
      <div className={styles.teamWrap}>
        <Team
          logoSrc={data.teams.visitors.logo}
          name={data.teams.visitors.code}
        />
      </div>
      <div>
        <div className={styles.matchStatus}>
          {/* date.start가 현재 일시와 동일하거나 그 이상이면 'live', 이전이면 '예정' end보다 이후면 '종료',*/}
          <p>30</p>
          <GameStatusTag size="lg" status="live" />
          <p>30</p>
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
              <td>{data.teams.visitors.name}</td>
              {data.scores.visitors.linescore.map((score, index) => (
                <td key={index}>{score || '-'}</td>
              ))}
            </tr>
            <tr>
              <td>{data.teams.home.name}</td>
              {data.scores.home.linescore.map((score, index) => (
                <td key={index}>{score || '-'}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <div className={styles.teamWrap}>
        <Team logoSrc={data.teams.home.logo} name={data.teams.home.code} />
      </div>
    </section>
  );
};

export default GameStatusSection;

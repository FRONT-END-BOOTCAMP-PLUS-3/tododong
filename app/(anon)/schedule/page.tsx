import styles from './page.module.scss';
import GameStatus from '@/types/game-status';
import DatePicker from './components/date-picker/DatePicker';
import GameCard from './components/game-card/GameCard';

// 선택한 날짜 경기 스케줄
const gameSchedule = [
  {
    date: '2024-02-21',
    gameId: '1',
    gameStatus: 'scheduled' as GameStatus,
    startTime: {
      date: '2025. 02. 21',
      time: '09:00 AM KST',
    },
    teams: {
      homeTeam: {
        nickname: 'Pacers',
        logoSrc:
          'https://upload.wikimedia.org/wikipedia/fr/thumb/c/cf/Pacers_de_l%27Indiana_logo.svg/1180px-Pacers_de_l%27Indiana_logo.svg.png',
        score: 0,
        isWinner: false,
      },
      awayTeam: {
        nickname: 'Grizzlies',
        logoSrc:
          'https://upload.wikimedia.org/wikipedia/en/thumb/f/f1/Memphis_Grizzlies.svg/1200px-Memphis_Grizzlies.svg.png',
        score: 0,
        isWinner: true,
      },
    },
  },
  {
    date: '2024-02-21',
    gameId: '2',
    gameStatus: 'live' as GameStatus,
    startTime: {
      date: '2025. 02. 21',
      time: '09:00 AM KST',
    },
    teams: {
      homeTeam: {
        nickname: '76ers',
        logoSrc:
          'https://upload.wikimedia.org/wikipedia/fr/4/48/76ers_2016.png',
        score: 113,
        isWinner: false,
      },
      awayTeam: {
        nickname: 'Celtics',
        logoSrc:
          'https://upload.wikimedia.org/wikipedia/fr/thumb/6/65/Celtics_de_Boston_logo.svg/1024px-Celtics_de_Boston_logo.svg.png',
        score: 127,
        isWinner: false,
      },
    },
  },
  {
    date: '2024-02-21',
    gameId: '3',
    gameStatus: 'final' as GameStatus,
    startTime: {
      date: '2025. 02. 21',
      time: '09:00 AM KST',
    },
    teams: {
      homeTeam: {
        nickname: 'Pacers',
        logoSrc:
          'https://upload.wikimedia.org/wikipedia/fr/thumb/c/cf/Pacers_de_l%27Indiana_logo.svg/1180px-Pacers_de_l%27Indiana_logo.svg.png',
        score: 113,
        isWinner: false,
      },
      awayTeam: {
        nickname: 'Grizzlies',
        logoSrc:
          'https://upload.wikimedia.org/wikipedia/en/thumb/f/f1/Memphis_Grizzlies.svg/1200px-Memphis_Grizzlies.svg.png',
        score: 127,
        isWinner: true,
      },
    },
  },
];

const Schedule = () => {
  return (
    <>
      <DatePicker />
      <main className={styles.cardWrapper}>
        {gameSchedule.map((game) => (
          <GameCard
            key={game.gameId}
            gameId={game.gameId}
            gameStatus={game.gameStatus}
            startTime={game.startTime}
            teams={game.teams}
          />
        ))}
      </main>
    </>
  );
};

export default Schedule;

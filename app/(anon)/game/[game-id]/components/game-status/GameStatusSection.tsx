'use client';

import { GameDetailDto } from '@/application/usecases/game/game-detail/dto/gameDetailDto';
import GameStatusTag from '@/components/game-status-tag/GameStatusTag';
import Team from '@/components/team/Team';
import { useEffect, useState } from 'react';
import styles from './GameStatusSection.module.scss';

type Props = {
  initialGameInfo: GameDetailDto;
};

const GameStatusSection = ({ initialGameInfo }: Props) => {
  const [gameInfo, setGameInfo] = useState(initialGameInfo);

  useEffect(() => {
    const fetchGameInfo = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/game/${gameInfo.gameId}`,
          {
            cache: 'no-store',
          }
        );
        if (!res.ok) return;
        const updated: GameDetailDto = await res.json();
        setGameInfo(updated);
      } catch (err) {
        console.error('게임 정보 갱신 실패', err);
      }
    };

    const interval = setInterval(fetchGameInfo, 10000);
    return () => clearInterval(interval);
  }, [gameInfo.gameId]);
  console.log(gameInfo);

  return (
    <section className={styles.container}>
      <div className={styles.teamWrap}>
        <Team
          logoSrc={gameInfo.teams.awayTeam.logoSrc}
          name={gameInfo.teams.awayTeam.code}
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
                <td>{gameInfo.teams.awayTeam.code}</td>
                {gameInfo.teams.awayTeam.periods.map((score, index) => (
                  <td key={index}>{score || '-'}</td>
                ))}
              </tr>
              <tr>
                <td>{gameInfo.teams.homeTeam.code}</td>
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
          name={gameInfo.teams.homeTeam.code}
        />
      </div>
    </section>
  );
};

export default GameStatusSection;

'use client';

import styles from './page.module.scss';
import BoxScoreTable from './components/BoxScoreTable';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetcher } from '@/utils';
import { BoxscoreDto } from '@/application/usecases/game/box-score/dto/boxscoreDto';

const BoxScore = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [boxscoreData, setBoxscoreData] = useState<BoxscoreDto>();

  const params = useParams();
  const gameId = params['game-id'];

  useEffect(() => {
    if (!gameId) return;

    const fetchBoxscore = async () => {
      try {
        const response = await fetcher<BoxscoreDto>(
          `/api/game/${gameId}/box-score`,
          {},
          setIsLoading
        );
        setBoxscoreData(response);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBoxscore();
  }, [gameId]);

  if (isLoading) return <div style={{ textAlign: 'center' }}>로딩중...</div>;
  if (!boxscoreData) {
    return (
      <div className={styles.scheduledGame}>추후 업데이트 예정입니다.</div>
    );
  }
  if (boxscoreData.game.status === 1) {
    return (
      <div className={styles.scheduledGame}>경기 시작 후 업데이트 됩니다.</div>
    );
  }

  return (
    <div className={styles.boxScoreContainer}>
      {/* 원정 팀 */}
      <BoxScoreTable data={boxscoreData.awayTeam} visitor={true} />
      {/* 홈 팀 */}
      <BoxScoreTable data={boxscoreData.homeTeam} visitor={false} />
    </div>
  );
};

export default BoxScore;

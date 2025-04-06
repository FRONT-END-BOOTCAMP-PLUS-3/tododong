'use client';

import styles from './page.module.scss';
import BoxScoreTable from './components/BoxScoreTable';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetcher } from '@/utils';
import { BoxscoreDto } from '@/application/usecases/game/box-score/dto/boxscoreDto';
import Loader from '@/components/loader/Loader';
import { useQuery } from '@tanstack/react-query';

const fetchBoxscore = async (gameId: string | string[]) => {
  const id = Array.isArray(gameId) ? gameId[0] : gameId;

  return fetcher<BoxscoreDto>(`/api/game/${id}/box-score`);
};

const BoxScore = () => {
  const params = useParams();
  const gameId = params['game-id'];

  const [queryOptions, setQueryOptions] = useState<{
    staleTime: number;
    refetchInterval: number | false;
  }>({ staleTime: 600000, refetchInterval: false });

  const {
    data: boxscoreData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['boxscore', gameId],
    queryFn: () => fetchBoxscore(gameId!),
    staleTime: queryOptions.staleTime,
    refetchInterval: queryOptions.refetchInterval,
    enabled: !!gameId,
  });

  useEffect(() => {
    if (boxscoreData?.game.status === 'scheduled') {
      setQueryOptions({ staleTime: 0, refetchInterval: false });
    } else if (boxscoreData?.game.status === 'live') {
      setQueryOptions({ staleTime: 10000, refetchInterval: 10000 });
    } else {
      setQueryOptions({ staleTime: 600000, refetchInterval: false });
    }
  }, [boxscoreData?.game.status]);

  if (isLoading || !boxscoreData) return <Loader />;
  if (!boxscoreData || error)
    return <div className={styles.statusInfo}>추후 업데이트 예정입니다.</div>;
  if (boxscoreData.game.status === 'scheduled')
    return (
      <div className={styles.statusInfo}>경기 시작 후 업데이트 됩니다.</div>
    );

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

'use client';

import styles from './page.module.scss';
import { fetcher } from '@/utils';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Timeline from './components/Timeline';
import {
  EventDto,
  PlaybyplayDto,
} from '@/application/usecases/game/play-by-play/dto/PlaybyplayDto';

const QUARTERS = ['1Q', '2Q', '3Q', '4Q'];

const findCurrentQuarter = (data: Array<EventDto[]>) => {
  let currentQuarter = 1;
  data.forEach((item, index) =>
    item[0] ? (currentQuarter = index + 1) : null
  );
  return currentQuarter;
};

const PlayByPlay = () => {
  const [isLoading, setIsLoading] = useState<boolean>(() => true);
  const [playByPlayData, setPlayByPlayData] = useState<PlaybyplayDto | null>(
    null
  );
  const [currentQuarter, setcurrentQuarter] = useState<number>(0);

  const params = useParams();
  const gameId = params['game-id'];

  // 쿼터 버튼 클릭 시
  const handleQuarterBtnClick = (quarter: number) => {
    if (quarter === currentQuarter) return;
    setcurrentQuarter(quarter);
  };

  useEffect(() => {
    if (!gameId) return;

    const fetchPlayByPlayData = async () => {
      try {
        const response = await fetcher<PlaybyplayDto>(
          `/api/game/${gameId}/play-by-play`
        );
        setPlayByPlayData(response);
        setcurrentQuarter(findCurrentQuarter(response.game.events));

        if (response.game.status !== 'live') {
          clearInterval(intervalFetch);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchPlayByPlayData();
    setIsLoading(false);

    const intervalFetch = setInterval(() => {
      fetchPlayByPlayData();
    }, 10000);

    // 언마운트될 때 정리
    return () => {
      clearInterval(intervalFetch);
    };
  }, [gameId]);

  if (isLoading) return <div>로딩 중...</div>;
  if (!playByPlayData || playByPlayData.game.status === 'scheduled') {
    return <p className={styles.statusInfo}>경기 시작 후 업데이트 됩니다.</p>;
  }

  const currentQuarterData = [
    ...playByPlayData.game.events[currentQuarter - 1],
  ].reverse();

  return (
    <section className={styles.section}>
      <h2 className="srOnly">{`${playByPlayData.game.date} ${playByPlayData.homeTeam.name} vs ${playByPlayData.awayTeam.name} 실시간 중계`}</h2>
      {/* 쿼터 선택 버튼 */}
      <div className={styles.quarterBtnContainer}>
        {QUARTERS.map((quarter, index) => (
          <button
            key={quarter}
            className={index + 1 === currentQuarter ? styles.active : ''}
            onClick={() => handleQuarterBtnClick(index + 1)}
          >
            {quarter}
          </button>
        ))}
      </div>
      {/* 실시간 중계 테이블 */}
      <table>
        <thead>
          <tr>
            <th scope="col" className={styles.tableHeaderTeam}>
              <span className="srOnly">{playByPlayData.awayTeam.name}</span>
            </th>
            <th scope="col" className={styles.tableHeaderTimeAndScore}>
              <span className="srOnly">시간 및 점수</span>
            </th>
            <th scope="col" className={styles.tableHeaderTeam}>
              <span className="srOnly">{playByPlayData.homeTeam.name}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {currentQuarterData
            ? currentQuarterData.map((item, index) => {
                const isPlayingActionType =
                  item.actionType !== 'game' && item.actionType !== 'period';
                const type =
                  item.teamId?.toString() === playByPlayData.homeTeam.id
                    ? 'home'
                    : 'away';
                return (
                  <Timeline
                    key={`${item.clock}_${item.edited}_${index}`}
                    type={type}
                    event={item}
                    isFirst={index === 0 && isPlayingActionType}
                  />
                );
              })
            : null}
        </tbody>
      </table>
    </section>
  );
};

export default PlayByPlay;

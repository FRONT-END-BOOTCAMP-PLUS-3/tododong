'use client';

import styles from './page.module.scss';
import { fetcher } from '@/utils';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Timeline from './components/Timeline';
import { PlayByPlayDto } from './mockDataDto';

const QUARTERS = ['1Q', '2Q', '3Q', '4Q'];

const PlayByPlay = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [playByPlayData, setPlayByPlayData] = useState<PlayByPlayDto | null>(
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
        setIsLoading(true);
        const response = await fetcher<PlayByPlayDto>(
          `/api/game/${gameId}/play-by-play`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          },
          setIsLoading
        );
        setPlayByPlayData(response);
        setcurrentQuarter(response.quarters.length);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPlayByPlayData();
  }, [gameId]);

  if (isLoading) return <div>로딩 중...</div>;
  if (!playByPlayData || playByPlayData.game.status === 'scheduled') {
    return <p className={styles.statusInfo}>경기 시작 후 업데이트 됩니다.</p>;
  }

  const currentQuarterData = playByPlayData.quarters[currentQuarter - 1];

  console.log(currentQuarterData);

  return (
    <section className={styles.section}>
      <h2 className="srOnly">{`${playByPlayData?.game.date} ${playByPlayData?.home.name} vs ${playByPlayData?.away.name} 실시간 중계`}</h2>
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
              <span className="srOnly">{playByPlayData.away.name}</span>
            </th>
            <th scope="col" className={styles.tableHeaderTimeAndScore}>
              <span className="srOnly">시간 및 점수</span>
            </th>
            <th scope="col" className={styles.tableHeaderTeam}>
              <span className="srOnly">{playByPlayData.home.name}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {currentQuarterData
            ? currentQuarterData.events
                .sort(
                  (a, b) =>
                    new Date(b.created).getTime() -
                    new Date(a.created).getTime()
                )
                .map((event) => {
                  const type =
                    event.statistics?.[0]?.team.id === playByPlayData.home.id
                      ? 'home'
                      : 'away';
                  return <Timeline key={event.id} type={type} event={event} />;
                })
            : null}
        </tbody>
      </table>
    </section>
  );
};

export default PlayByPlay;

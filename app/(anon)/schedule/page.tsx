'use client';

import styles from './page.module.scss';
import { useEffect, useState } from 'react';
import useDateStore from '@/stores/dateStore';
import { fetcher } from '@/utils';
import DatePicker from './components/date-picker/DatePicker';
import GameCard from './components/game-card/GameCard';
import { ScheduledGameDto } from '@/application/usecases/schedule/dto/ScheduledGameDto';

const Schedule = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [scheduledGames, setScheduledGames] = useState<ScheduledGameDto[]>();
  const date = useDateStore((state) => state.date);

  useEffect(() => {
    if (!date) return;

    const fetchScheduledGames = async () => {
      try {
        const response = await fetcher<ScheduledGameDto[]>(
          `/api/schedule/${date}`,
          {},
          setIsLoading
        );

        setScheduledGames(response);
      } catch (error) {
        console.error(error);
      }
    };

    fetchScheduledGames();
  }, [date]);

  return (
    <>
      <DatePicker />
      <main>
        {isLoading && <div style={{ textAlign: 'center' }}>로딩중...</div>}
        {scheduledGames && scheduledGames.length > 0 ? (
          <div className={styles.cardWrapper}>
            {scheduledGames.map((game) => (
              <GameCard
                key={game.gameId}
                gameId={game.gameId}
                gameStatus={game.gameStatus}
                startTime={game.startTime}
                teams={game.teams}
              />
            ))}
          </div>
        ) : (
          <div className={styles.schedulePrompt}>일정이 없습니다.</div>
        )}
      </main>
    </>
  );
};

export default Schedule;

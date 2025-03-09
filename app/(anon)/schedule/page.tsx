'use client';

import styles from './page.module.scss';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetcher } from '@/utils';
import DatePicker from './components/date-picker/DatePicker';
import GameCard from './components/game-card/GameCard';
import { ScheduledGameDto } from '@/application/usecases/schedule/dto/ScheduledGameDto';
import { ScheduledGameCountDto } from '@/application/usecases/schedule/dto/ScheduledGameCountDto';

const Schedule = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const today = new Date();
  const initialDate = searchParams.get('date')
    ? new Date(searchParams.get('date')!)
    : today;
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [scheduledGames, setScheduledGames] = useState<ScheduledGameDto[]>();
  const [scheduledGameCounts, setScheduledGameCounts] = useState<
    ScheduledGameCountDto[]
  >([]);

  useEffect(() => {
    const fetchScheduledGames = async () => {
      try {
        const response = await fetcher<ScheduledGameCountDto[]>(
          `${process.env.NEXT_PUBLIC_API_URL}/schedule`
        );

        setScheduledGameCounts([...response]);
      } catch (error) {
        console.error(error);
      }
    };

    fetchScheduledGames();
  }, []);

  useEffect(() => {
    if (!selectedDate) return;

    const fetchScheduledGames = async () => {
      try {
        const response = await fetcher<ScheduledGameDto[]>(
          `${process.env.NEXT_PUBLIC_API_URL}/schedule/${dayjs(selectedDate).format('YYYY-MM-DD')}`
        );

        setScheduledGames(response);
      } catch (error) {
        console.error(error);
      }
    };

    router.push(`?date=${dayjs(selectedDate).format('YYYY-MM-DD')}`);
    fetchScheduledGames();
  }, [selectedDate]);

  return (
    <>
      <DatePicker
        selectedDate={selectedDate}
        scheduledGameCounts={scheduledGameCounts}
        onDateChange={setSelectedDate}
      />
      <main>
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

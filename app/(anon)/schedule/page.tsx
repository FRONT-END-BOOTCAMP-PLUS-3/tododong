'use client';

import styles from './page.module.scss';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetcher } from '@/utils';
import DatePicker from './components/date-picker/DatePicker';
import GameCard from './components/game-card/GameCard';
import { ScheduledGameDto } from '@/application/usecases/schedule/dto/ScheduledGameDto';
import { ScheduledGameCountDto } from '@/application/usecases/schedule/dto/ScheduledGameCountDto';
import Loader from '@/components/loader/Loader';

const Schedule = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const today = new Date();
  const initialDate = searchParams.get('date')
    ? new Date(searchParams.get('date')!)
    : today;
  const [selectedDate, setSelectedDate] = useState(initialDate);

  const fetchScheduledGameCounts = async () => {
    return await fetcher<ScheduledGameCountDto[]>(
      `${process.env.NEXT_PUBLIC_API_URL}/schedule`
    );
  };

  const {
    data: scheduledGameCounts = [],
    // isLoading: isCountsLoading,
    // error: countsError,
  } = useQuery({
    queryKey: ['scheduledGameCounts'],
    queryFn: fetchScheduledGameCounts,
  });

  const fetchScheduledGames = async (date: Date) => {
    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    return fetcher<ScheduledGameDto[]>(
      `${process.env.NEXT_PUBLIC_API_URL}/schedule/${formattedDate}`
    );
  };

  const {
    data: scheduledGames = [],
    isLoading: isGamesLoading,
    // error: gamesError,
  } = useQuery({
    queryKey: ['scheduledGames', selectedDate],
    queryFn: () => fetchScheduledGames(selectedDate),
    enabled: !!selectedDate, // selectedDate가 설정된 후에만 실행
  });

  // selectedDate 변경 시 데이터 가져오기 및 URL 변경
  useEffect(() => {
    if (!selectedDate) return;
    const formattedDate = dayjs(selectedDate).format('YYYY-MM-DD');
    if (searchParams.get('date') !== formattedDate) {
      router.push(`?date=${formattedDate}`);
    }
  }, [selectedDate, router, searchParams]);

  // 브라우저 뒤로가기 감지하여 selectedDate 업데이트
  useEffect(() => {
    const handlePopState = () => {
      const newDate = new URLSearchParams(window.location.search).get('date');
      if (newDate) {
        setSelectedDate(new Date(newDate));
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <>
      <DatePicker
        selectedDate={selectedDate}
        scheduledGameCounts={scheduledGameCounts}
        onDateChange={setSelectedDate}
      />
      <main>
        {isGamesLoading ? (
          <Loader className={styles.loader} />
        ) : scheduledGames && scheduledGames.length > 0 ? (
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

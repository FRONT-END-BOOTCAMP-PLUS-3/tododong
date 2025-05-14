'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import styles from './TodayGameSection.module.scss';
import './swiper.scss';

/* swiper */
import type { Swiper as SwiperType } from 'swiper';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { ScheduledGameDto } from '@/application/usecases/schedule/dto/ScheduledGameDto';
import Icon from '@/components/icon/Icon';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { NavigationOptions } from 'swiper/types';
import TodayGameCard from './TodayGameCard';

const TodayGameSection = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLastSlide, setIsLastSlide] = useState(() => false);
  const [isFirstSlide, setIsFirstSlide] = useState(() => true);
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);

  const fetchTodayGames = async (): Promise<ScheduledGameDto[]> => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/schedule/${dayjs().format('YYYY-MM-DD')}`
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || `HTTP error! Status: ${res.status}`);
    }

    return res.json();
  };

  const { data: todayGamesRaw = [], isLoading: isTodayGamesLoading } = useQuery(
    {
      queryKey: ['todayGames', dayjs().format('YYYY-MM-DD')],
      queryFn: fetchTodayGames,
    }
  );

  const todayGames = useMemo(
    () =>
      todayGamesRaw.length < 5
        ? [...todayGamesRaw, ...Array(5 - todayGamesRaw.length).fill(null)]
        : todayGamesRaw,
    [todayGamesRaw]
  );

  const shouldShowNavigation = todayGames.length > 5;

  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  useEffect(() => {
    if (
      swiperInstance &&
      prevRef.current &&
      nextRef.current &&
      typeof swiperInstance.params.navigation !== 'boolean'
    ) {
      const navigationParams = swiperInstance.params
        .navigation as NavigationOptions;
      navigationParams.prevEl = prevRef.current;
      navigationParams.nextEl = nextRef.current;

      swiperInstance.navigation.destroy(); // 기존 navigation 제거
      swiperInstance.navigation.init(); // 새로 init
      swiperInstance.navigation.update(); // 버튼 갱신
    }
  }, [swiperInstance, todayGames]);

  return (
    <section className={styles.todayGameContainer}>
      <h2>
        오늘의
        <br />
        경기 일정
      </h2>
      {isTodayGamesLoading ? (
        <div className={styles.loadingContainer}>
          {[...Array(5)].map((_, index) => (
            <div key={index} className={styles.loading} />
          ))}
        </div>
      ) : (
        <>
          {shouldShowNavigation && (
            <button
              ref={prevRef}
              type="button"
              className={styles.customPrev}
              disabled={isFirstSlide}
            >
              <Icon id="left" width={6.55} height={11.15} />
            </button>
          )}
          <Swiper
            modules={[Navigation]}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onSwiper={setSwiperInstance}
            onSlideChange={(swiper) => {
              setIsLastSlide(swiper.isEnd);
              setIsFirstSlide(swiper.isBeginning);
            }}
            breakpoints={{
              0: {
                slidesPerView: 'auto',
                slidesPerGroup: 1,
              },
              1280: {
                slidesPerView: 5,
                slidesPerGroup: 3,
              },
            }}
            spaceBetween={16}
            centerInsufficientSlides // 마지막에 빈 공간 없이 정렬
            className={`${todayGames.length <= 5 ? 'limited-swiper' : 'swiper'}`}
          >
            {todayGames.map((data, index) => (
              <SwiperSlide
                key={data?.gameId ?? index}
                className={`custom-swiper-slide`}
              >
                <TodayGameCard
                  gameId={data?.gameId}
                  gameStatus={data?.gameStatus}
                  startTime={data?.startTime}
                  teams={data?.teams}
                />
              </SwiperSlide>
            ))}
          </Swiper>
          {shouldShowNavigation && (
            <button
              ref={nextRef}
              type="button"
              className={styles.customNext}
              disabled={isLastSlide}
            >
              <Icon id="right" width={6.55} height={11.15} />
            </button>
          )}
        </>
      )}
    </section>
  );
};

export default TodayGameSection;

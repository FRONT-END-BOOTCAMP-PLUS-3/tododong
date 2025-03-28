'use client';

import { useEffect, useRef, useState } from 'react';

import styles from './TodayGameSection.module.scss';
import './swiper.scss';

/* swiper */
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';

import { ScheduledGameDto } from '@/application/usecases/schedule/dto/ScheduledGameDto';
import Icon from '@/components/icon/Icon';
import { fetcher } from '@/utils';
import dayjs from 'dayjs';
import { NavigationOptions } from 'swiper/types';
import TodayGameCard from './TodayGameCard';

const TodayGameSection = () => {
  const [isLastSlide, setIsLastSlide] = useState(() => false);
  const [isFirstSlide, setIsFirstSlide] = useState(() => true);
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);

  const [todayGames, setTodayGames] = useState<ScheduledGameDto[]>([]);

  useEffect(() => {
    const fetchScheduledGames = async () => {
      try {
        const response = await fetcher<ScheduledGameDto[]>(
          `${process.env.NEXT_PUBLIC_API_URL}/schedule/${dayjs().format('YYYY-MM-DD')}`
        );
        // fetch가 끝난 데이터
        setTodayGames([...response]);
        // prev가 아닌 reponse(todaygames) -> 전에 있던 값 참조

        setTodayGames((prev) => {
          if (prev.length < 5)
            return [...prev, ...Array(5 - prev.length).fill(null)];
          else return prev;
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchScheduledGames();
  }, []);

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
  }, [swiperInstance, prevRef.current, nextRef.current, todayGames]);

  return (
    <section className={styles.todayGameContainer}>
      <h2>
        오늘의
        <br />
        경기 일정
      </h2>

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
        slidesPerView={5} // 한 번에 보이는 카드 개수
        slidesPerGroup={3} // 내비게이션 클릭 시 이동할 개수
        spaceBetween={16}
        centerInsufficientSlides // 마지막에 빈 공간 없이 정렬
        className={`swiper ${todayGames.length <= 5 ? 'limited-swiper' : 'full-swiper'}`}
      >
        {todayGames.map((data, index) => (
          <SwiperSlide key={data?.gameId ?? index}>
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
    </section>
  );
};

export default TodayGameSection;

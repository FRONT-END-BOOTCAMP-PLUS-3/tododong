'use client';

import { useRef, useState } from 'react';

import styles from './TodayGameSection.module.scss';
import './swiper.scss';

/* swiper */
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import Icon from '@/components/icon/Icon';
import TodayGameCard from './TodayGameCard';
import { NavigationOptions } from 'swiper/types';

const dto = [
  {
    id: 14901,
    game: {
      startTime: '10:00 AM KST',
      status: 'scheduled',
    },
    home: {
      nickname: 'Bulls',
      logo: 'https://upload.wikimedia.org/wikipedia/fr/thumb/d/d1/Bulls_de_Chicago_logo.svg/1200px-Bulls_de_Chicago_logo.svg.png',
      points: 56,
    },
    away: {
      nickname: 'Hawks',
      logo: 'https://upload.wikimedia.org/wikipedia/fr/e/ee/Hawks_2016.png',
      points: 56,
    },
  },
  {
    id: 14902,
    game: {
      startTime: '09:00 AM KST',
      status: 'live',
    },
    home: {
      nickname: 'Cavaliers',
      logo: 'https://upload.wikimedia.org/wikipedia/fr/thumb/0/06/Cavs_de_Cleveland_logo_2017.png/150px-Cavs_de_Cleveland_logo_2017.png',
      points: 56,
    },
    away: {
      nickname: 'Nets',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Brooklyn_Nets_newlogo.svg/130px-Brooklyn_Nets_newlogo.svg.png',
      points: 56,
    },
  },
  {
    id: 14903,
    game: {
      startTime: '10:00 AM KST',
      status: 'scheduled',
    },
    home: {
      nickname: 'Bulls',
      logo: 'https://upload.wikimedia.org/wikipedia/fr/thumb/d/d1/Bulls_de_Chicago_logo.svg/1200px-Bulls_de_Chicago_logo.svg.png',
      points: 56,
    },
    away: {
      nickname: 'Hawks',
      logo: 'https://upload.wikimedia.org/wikipedia/fr/e/ee/Hawks_2016.png',
      points: 56,
    },
  },
  {
    id: 14904,
    game: {
      startTime: '09:00 AM KST',
      status: 'live',
    },
    home: {
      nickname: 'Cavaliers',
      logo: 'https://upload.wikimedia.org/wikipedia/fr/thumb/0/06/Cavs_de_Cleveland_logo_2017.png/150px-Cavs_de_Cleveland_logo_2017.png',
      points: 56,
    },
    away: {
      nickname: 'Nets',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Brooklyn_Nets_newlogo.svg/130px-Brooklyn_Nets_newlogo.svg.png',
      points: 56,
    },
  },
  {
    id: 14905,
    game: {
      startTime: '10:00 AM KST',
      status: 'scheduled',
    },
    home: {
      nickname: 'Bulls',
      logo: 'https://upload.wikimedia.org/wikipedia/fr/thumb/d/d1/Bulls_de_Chicago_logo.svg/1200px-Bulls_de_Chicago_logo.svg.png',
      points: 56,
    },
    away: {
      nickname: 'Hawks',
      logo: 'https://upload.wikimedia.org/wikipedia/fr/e/ee/Hawks_2016.png',
      points: 56,
    },
  },
  {
    id: 14906,
    game: {
      startTime: '09:00 AM KST',
      status: 'live',
    },
    home: {
      nickname: 'Cavaliers',
      logo: 'https://upload.wikimedia.org/wikipedia/fr/thumb/0/06/Cavs_de_Cleveland_logo_2017.png/150px-Cavs_de_Cleveland_logo_2017.png',
      points: 56,
    },
    away: {
      nickname: 'Nets',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Brooklyn_Nets_newlogo.svg/130px-Brooklyn_Nets_newlogo.svg.png',
      points: 56,
    },
  },
];

const TodayGameSection = () => {
  const [isLastSlide, setIsLastSlide] = useState(() => false);
  const [isFirstSlide, setIsFirstSlide] = useState(() => true);
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);

  // 최소 5개가 되도록 빈 카드 추가
  const totalCards = [...dto, ...Array(Math.max(0, 5 - dto.length)).fill(null)];

  const shouldShowNavigation = totalCards.length > 5;

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
        onSwiper={(swiper) => {
          setTimeout(() => {
            if (
              prevRef.current &&
              nextRef.current &&
              typeof swiper.params.navigation !== 'boolean'
            ) {
              const navigationParams = swiper.params
                .navigation as NavigationOptions;
              navigationParams.prevEl = prevRef.current;
              navigationParams.nextEl = nextRef.current;
              swiper.navigation.init();
              swiper.navigation.update();
            }
          });
        }}
        onSlideChange={(swiper) => {
          setIsLastSlide(swiper.isEnd);
          setIsFirstSlide(swiper.isBeginning);
        }}
        slidesPerView={5} // 한 번에 보이는 카드 개수
        slidesPerGroup={3} // 내비게이션 클릭 시 이동할 개수
        spaceBetween={16}
        centerInsufficientSlides // 마지막에 빈 공간 없이 정렬
        className={`swiper ${totalCards.length <= 5 ? 'limited-swiper' : 'full-swiper'}`}
      >
        {totalCards.map((data, index) => (
          <SwiperSlide key={data?.id ?? index}>
            <TodayGameCard data={data} />
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

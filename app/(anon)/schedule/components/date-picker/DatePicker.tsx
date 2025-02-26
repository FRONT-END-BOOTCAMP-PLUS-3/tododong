'use client';

import styles from './DatePicker.module.scss';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './calendar-custom.scss';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Swiper as SwiperClass } from 'swiper';
import { useCallback, useEffect, useRef, useState } from 'react';
import useDateStore from '@/stores/useDateStore';
import Icon from '@/components/icon/Icon';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

dayjs.locale('ko'); // 날짜 포맷 한국어로 지정

const gamesByDate = [
  { date: '2025-02-05', games: 2 },
  { date: '2025-02-06', games: 2 },
  { date: '2025-02-07', games: 2 },
  { date: '2025-02-08', games: 2 },
  { date: '2025-02-09', games: 2 },
  { date: '2025-02-10', games: 2 },
  { date: '2025-02-11', games: 1 },
  { date: '2025-02-12', games: 3 },
  { date: '2025-02-13', games: 1 },
  { date: '2025-02-14', games: 0 },
  { date: '2025-02-15', games: 2 },
  { date: '2025-02-16', games: 1 },
  { date: '2025-02-17', games: 3 },
  { date: '2025-02-18', games: 1 },
  { date: '2025-02-19', games: 0 },
  { date: '2025-02-20', games: 2 },
  { date: '2025-02-21', games: 1 },
  { date: '2025-02-22', games: 3 },
  { date: '2025-02-23', games: 0 },
  { date: '2025-02-24', games: 8 },
];

const generateDates = (startDate: Date, range: number = 60) => {
  const start = dayjs(startDate).subtract(range, 'day'); // startDate - 60일
  const end = dayjs(startDate).add(range, 'day'); // startDate + 60일
  const dates = [];

  for (
    let date = start;
    date.isBefore(end) || date.isSame(end, 'day');
    date = date.add(1, 'day')
  ) {
    dates.push(date.toDate());
  }

  return dates;
};

const DatePicker = () => {
  const { setDate } = useDateStore();
  const swiperRef = useRef<SwiperClass | null>(null);
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [dates, setDates] = useState<Date[]>(() => generateDates(today));
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const updateDate = useCallback(
    (date: Date) => {
      setSelectedDate(date);
      setDate(date);
    },
    [setDate]
  );

  const updateDates = (date: Date) => {
    setDates((prev) => {
      if (date < prev[0]) return [...generateDates(date), ...prev].flat();
      if (date > prev[prev.length - 1])
        return [...prev, ...generateDates(date)].flat();
      return prev;
    });
  };

  // 한 달 단위로 날짜 이동하는 함수
  const changeDateByMonth = (direction: 'prev' | 'next') => {
    const date = dayjs(selectedDate)
      .add(direction === 'prev' ? -1 : 1, 'month')
      .startOf('month')
      .toDate();

    updateDate(date);
    updateDates(date);
  };

  // 하루씩 날짜 이동하는 함수
  const changeDateByDay = (direction: 'prev' | 'next') => {
    const date = dayjs(selectedDate)
      .add(direction === 'prev' ? -1 : 1, 'day')
      .toDate();

    updateDate(date);
  };

  // 날짜 선택
  const handleSelectDate = (value: Value) => {
    if (!value) return;

    const date = Array.isArray(value) ? value[0] : value;
    if (!date) return;

    updateDate(date);
    updateDates(date);
    setIsCalendarOpen(false); // 달력 닫기
  };

  // 오늘 날짜 선택(오늘 버튼)
  const handleSelectToday = () => {
    updateDate(today);
    setIsCalendarOpen(false); // 달력 닫기
  };

  const handleCloseCalendar = () => {
    setIsCalendarOpen(false); // 달력 닫기
  };

  useEffect(() => {
    if (swiperRef.current) {
      const index = dates.findIndex((date) =>
        dayjs(date).isSame(selectedDate, 'day')
      ); // 선택한 날짜의 인덱스 찾기
      if (index !== -1) swiperRef.current.slideTo(index); // Swiper에서 선택한 날짜를 가운데로 이동
    }
  }, [selectedDate, dates]);

  return (
    <>
      <div className={styles.wrapper}>
        {/* 달 이동 */}
        <div className={styles.monthNavigation}>
          <button onClick={() => changeDateByMonth('prev')}>
            <Icon id="left" width={6.55} height={11.15} />
          </button>
          {dayjs(selectedDate).format('YYYY.MM')}
          <button onClick={() => changeDateByMonth('next')}>
            <Icon id="right" width={6.55} height={11.15} />
          </button>
        </div>
        {/* 달력 버튼 */}
        <button
          type="button"
          className={styles.calendarBtn}
          onClick={() => setIsCalendarOpen((prev) => !prev)}
        >
          <Icon id="calendar" width={18} height={20} />
          <Icon id="down" width={11.15} height={6.55} />
        </button>
      </div>

      {/* 달력 */}
      {isCalendarOpen && (
        <div className={styles.calendarContainer} onClick={handleCloseCalendar}>
          <div className={styles.calendar} onClick={(e) => e.stopPropagation()}>
            <Calendar
              value={selectedDate}
              onChange={handleSelectDate}
              formatDay={(locale, date) => {
                return dayjs(date).isSame(dayjs(), 'day')
                  ? '' // 오늘
                  : dayjs(date).format('D'); // '일' 제거 숫자만 보이게
              }}
              formatMonthYear={(locale, date) => dayjs(date).format('M월')}
              calendarType="gregory" // 일요일부터 시작
              showNeighboringMonth={false} // 이전달, 다음달 날짜 숨기기
              next2Label={null} // +1년 & +10년 이동 버튼 숨기기
              prev2Label={null} // -1년 & -10년 이동 버튼 숨기기
              minDetail="year" // 10년 단위 연도 숨기기
              tileContent={({ date, view }) => {
                const isToday = dayjs(date).isSame(dayjs(), 'day');
                const gameSchedule = gamesByDate.find((schedule) =>
                  dayjs(schedule.date).isSame(dayjs(date), 'day')
                );
                const isDisabled = gameSchedule?.games === 0;
                return (
                  <>
                    {view === 'month' && isToday && <span>오늘</span>}
                    {view === 'month' && (
                      <div
                        className={`${styles.gameSchedule} ${isDisabled ? styles.disabled : ''}`}
                      >
                        <span className="srOnly">경기 수</span>
                        {gameSchedule?.games}
                      </div>
                    )}
                  </>
                );
              }}
              tileDisabled={({ date, view }) => {
                if (view === 'month') {
                  const gameSchedule = gamesByDate.find((schedule) =>
                    dayjs(schedule.date).isSame(dayjs(date), 'day')
                  );
                  return gameSchedule?.games === 0; // 경기 수가 0이면 비활성화
                }
                return false;
              }}
            />
            <button className={styles.todayBtn} onClick={handleSelectToday}>
              오늘
            </button>
            <button className={styles.closeBtn} onClick={handleCloseCalendar}>
              <Icon id="close" width={12} />
            </button>
          </div>
        </div>
      )}

      {/* 날짜 Swiper */}
      <div className={styles.swiper}>
        <button onClick={() => changeDateByDay('prev')}>
          <Icon id="left" width={6.55} height={11.15} />
        </button>
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper; // Swiper 인스턴스 저장
          }}
          slidesPerView={7} // 7개씩 표시
          centeredSlides={true} // 가운데 정렬
          onSlideChange={() => {
            if (!swiperRef.current) return;

            const index = swiperRef.current.activeIndex;
            const date = dates[index];

            updateDate(date);

            // 선택한 날짜가 dates 배열의 앞에서 또는 뒤에서 열 번째일 경우 dates 재설정
            if (index === 10 || index === dates.length - 10) {
              setDates(generateDates(date));
            }
          }}
        >
          {dates.map((date, index) => (
            <SwiperSlide
              key={index}
              className={styles.swiperSlide}
              onClick={() => {
                updateDate(date);

                const firstDate = dates[0];
                const lastDate = dates[dates.length - 1];

                // 선택한 날짜가 dates 배열의 앞에서 또는 뒤에서 열 번째일 경우 dates 재설정
                if (
                  dayjs(date).diff(firstDate, 'day') <= 10 ||
                  dayjs(lastDate).diff(date, 'day') <= 10
                ) {
                  setDates(generateDates(date));
                }
              }}
            >
              <div className={styles.day}>{dayjs(date).format('dd')}</div>
              <div
                className={`${styles.date} ${dayjs(date).isSame(selectedDate, 'day') ? styles.selected : ''}`}
              >
                {dayjs(date).format('D')}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <button onClick={() => changeDateByDay('next')}>
          <Icon id="right" width={6.55} height={11.15} />
        </button>
      </div>
    </>
  );
};

export default DatePicker;

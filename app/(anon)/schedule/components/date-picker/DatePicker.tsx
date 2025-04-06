'use client';

import styles from './DatePicker.module.scss';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './calendar-custom.scss';
import { Value } from 'react-calendar/dist/esm/shared/types.js';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Swiper as SwiperClass } from 'swiper';
import { useEffect, useRef, useState } from 'react';
import { generateDates } from '@/utils';
import Icon from '@/components/icon/Icon';
import useBodyScrollLock from '@/hooks/useBodyScrollLock';
import { ScheduledGameCountDto } from '@/application/usecases/schedule/dto/ScheduledGameCountDto';

dayjs.locale('ko'); // 날짜 포맷 한국어로 지정

type DatePickerProps = {
  selectedDate: Date;
  scheduledGameCounts: ScheduledGameCountDto[];
  onDateChange: (date: Date) => void;
};

const DatePicker = ({
  selectedDate,
  scheduledGameCounts,
  onDateChange,
}: DatePickerProps) => {
  const swiperRef = useRef<SwiperClass | null>(null);
  const [dates, setDates] = useState<Date[]>(() => generateDates(selectedDate));
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  useBodyScrollLock(isCalendarOpen);

  const updateDates = (date: Date) => {
    setDates(generateDates(date));
  };

  // 달 이동하는 함수
  const changeDateByMonth = (direction: 'prev' | 'next') => {
    const date =
      direction === 'prev'
        ? dayjs(selectedDate).subtract(1, 'month').endOf('month').toDate() // 이전 달은 31일로
        : dayjs(selectedDate).add(1, 'month').startOf('month').toDate(); // 다음 달은 1일로

    onDateChange(date);
    updateDates(date);
  };

  // 하루씩 날짜 이동하는 함수
  const changeDateByDay = (direction: 'prev' | 'next') => {
    const date = dayjs(selectedDate)
      .add(direction === 'prev' ? -1 : 1, 'day')
      .toDate();

    onDateChange(date);
  };

  // 날짜 선택
  const handleSelectDate = (value: Value) => {
    if (!value) return;

    const date = Array.isArray(value) ? value[0] : value;
    if (!date) return;

    onDateChange(date);
    updateDates(date);
    handleCloseCalendar();
  };

  // 달력 닫기
  const handleCloseCalendar = () => {
    setIsCalendarOpen(false);
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
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* 달 이동 */}
        <div className={styles.monthNavigation}>
          <button
            onClick={() => changeDateByMonth('prev')}
            className={styles.arrowBtn}
          >
            <Icon id="left" width={6.55} height={11.15} />
          </button>
          {dayjs(selectedDate).format('YYYY.MM')}
          <button
            onClick={() => changeDateByMonth('next')}
            className={styles.arrowBtn}
          >
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

      <div
        className={`${styles.calendarContainer} ${isCalendarOpen ? styles.open : ''}`}
        onClick={handleCloseCalendar}
      >
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
              const gameSchedule = scheduledGameCounts?.find((schedule) =>
                dayjs(schedule.date).isSame(dayjs(date), 'day')
              );
              const isDisabled = !gameSchedule;
              return (
                <>
                  {view === 'month' && isToday && <span>오늘</span>}
                  {view === 'month' && (
                    <div
                      className={`${styles.gameSchedule} ${isDisabled ? styles.disabled : ''}`}
                    >
                      <span className="srOnly">경기 수</span>
                      {gameSchedule ? gameSchedule.gameCount : 0}
                    </div>
                  )}
                </>
              );
            }}
            tileDisabled={({ date, view }) => {
              if (view === 'month') {
                const gameSchedule = scheduledGameCounts?.find((schedule) =>
                  dayjs(schedule.date).isSame(dayjs(date), 'day')
                );
                return !gameSchedule;
              }
              return false;
            }}
          />
          <button
            className={styles.todayBtn}
            onClick={() => handleSelectDate(new Date())}
          >
            오늘
          </button>
          <button className={styles.closeBtn} onClick={handleCloseCalendar}>
            <Icon id="close" width={12} />
          </button>
        </div>
      </div>

      {/* 날짜 Swiper */}
      <div className={styles.swiper}>
        <button
          onClick={() => changeDateByDay('prev')}
          className={`${styles.arrowBtn} ${
            dayjs(selectedDate).isSame(
              dayjs(selectedDate).startOf('month'),
              'day'
            )
              ? styles.hidden
              : ''
          }`}
        >
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
            const date = dates[swiperRef.current.activeIndex];
            onDateChange(date);
          }}
        >
          {dates.map((date, index) => (
            <SwiperSlide
              key={index}
              className={styles.swiperSlide}
              onClick={() => {
                onDateChange(date);
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
        <button
          onClick={() => changeDateByDay('next')}
          className={`${styles.arrowBtn} ${
            dayjs(selectedDate).isSame(
              dayjs(selectedDate).endOf('month'),
              'day'
            )
              ? styles.hidden
              : ''
          }`}
        >
          <Icon id="right" width={6.55} height={11.15} />
        </button>
      </div>
    </div>
  );
};

export default DatePicker;

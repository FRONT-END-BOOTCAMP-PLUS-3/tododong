import dayjs from 'dayjs';

const generateDates = (date: Date) => {
  const start = dayjs(date).startOf('month'); // 해당 월의 1일
  const end = dayjs(date).endOf('month'); // 해당 월의 마지막 날
  const dates = [];

  for (
    let d = start;
    d.isBefore(end) || d.isSame(end, 'day');
    d = d.add(1, 'day')
  ) {
    dates.push(d.toDate());
  }

  return dates;
};

export default generateDates;

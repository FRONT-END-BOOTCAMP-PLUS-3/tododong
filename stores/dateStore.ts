import { create } from 'zustand';
import dayjs from 'dayjs';

type State = {
  date: string;
};

type Action = {
  setDate: (date: Date) => void;
};

const useDateStore = create<State & Action>((set) => ({
  date: dayjs().format('YYYY-MM-DD'), // 오늘 날짜 'yyyy-mm-dd' 형태로 초기화
  setDate: (date: Date) => set({ date: dayjs(date).format('YYYY-MM-DD') }),
}));

export default useDateStore;

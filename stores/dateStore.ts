import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import dayjs from 'dayjs';

interface DateState {
  date: string;
  setDate: (date: Date) => void;
}

export const useDateStore = create<DateState>()(
  persist(
    (set) => ({
      date: dayjs().format('YYYY-MM-DD'), // 오늘 날짜 'yyyy-mm-dd' 형태로 초기화
      setDate: (date: Date) => set({ date: dayjs(date).format('YYYY-MM-DD') }),
    }),
    {
      name: 'date-storage', // localStorage에 저장될 키 이름
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useDateStore;

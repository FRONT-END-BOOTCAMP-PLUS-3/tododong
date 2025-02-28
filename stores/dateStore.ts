import { create } from 'zustand';

type State = {
  date: Date;
};

type Action = {
  setDate: (date: Date) => void;
};

const useDateStore = create<State & Action>((set) => ({
  date: new Date(),
  setDate: (date: Date) => set({ date }),
}));

export default useDateStore;

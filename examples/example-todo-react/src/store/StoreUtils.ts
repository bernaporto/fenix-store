import { store } from './store';
import { StorePath } from './StorePath';
import type { TTaskItem } from '../types';

export const StoreUtils = {
  tasks: {
    create: (label: string) => {
      const id = Date.now().toString();

      store.on<TTaskItem>(StorePath.TASK(id)).set({
        id,
        label,
        completed: false,
      });
    },

    delete: (id: string) => {
      store.on(StorePath.TASK(id)).reset();
    },
  },

  darkMode: {
    toggle: () => {
      store.on(StorePath.DARK_MODE).update((curr) => !curr);
    },
  },
};

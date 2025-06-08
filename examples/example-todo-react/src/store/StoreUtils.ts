import { store } from './store';

export const StoreUtils = {
  tasks: {
    create: (label: string) => {
      const id = Date.now().toString();

      store.on(`tasks.items.${id}`).set({
        id,
        label,
        completed: false,
      });
    },

    delete: (id: string) => {
      store.on(`tasks.items.${id}`).reset();
    },
  },

  darkMode: {
    toggle: () => {
      store.on('darkMode').update((curr) => !curr);
    },
  },
};

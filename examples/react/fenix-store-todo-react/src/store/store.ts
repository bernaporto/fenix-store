import { FenixStore } from '@bernaporto/fenix-store';
import type { TTaskItem } from '../types';
import type { TAppState } from './types';
import { StorePath } from './paths';

// Create the store with initial value to make sure that these paths will never return undefined
export const store = FenixStore.create<TAppState>(
  {
    tasks: {
      ids: [],
      items: {},
    },
  },
  {
    debug: import.meta.env.MODE === 'development',
  },
);

// Add a middleware to set the id list once items change
store.effects.use<Record<string, TTaskItem>>((path, next) => {
  if (path === StorePath.TASKS) {
    store.on(StorePath.TASK_IDS).set(Object.keys(next));
  }
});

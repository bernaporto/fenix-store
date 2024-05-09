import { FenixStore } from '@bernaporto/fenix-store';
import type { TAppState, TTaskMap } from '../types';
import { StorePath } from './StorePath';
import { Storage } from './Storage';

const equals = (a: unknown, b: unknown): boolean => {
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;

    return a.every((item) => b.some((bItem) => equals(item, bItem)));
  }

  return a === b;
};

const getStore = () => {
  // Create the store with initial value to make sure that these paths will never return undefined
  const store = FenixStore.create<TAppState>(
    {
      tasks: {
        ids: [],
        items: {},
      },
    },
    {
      debug: import.meta.env.MODE === 'development',
      utils: {
        equals,
      },
    },
  );

  // Load tasks from storage
  const maybeTasks = Storage.get();
  if (maybeTasks) {
    store.on(StorePath.TASKS).set(maybeTasks);
    store.on(StorePath.TASK_IDS).set(Object.keys(maybeTasks));
  }

  // Subscribe to set the id list once items change
  store.on(StorePath.TASKS).subscribe((tasks: TTaskMap) => {
    // Update the ids list
    store.on(StorePath.TASK_IDS).set(Object.keys(tasks));

    // Save to storage
    Storage.save(tasks);
  });

  return store;
};

export const store = getStore();

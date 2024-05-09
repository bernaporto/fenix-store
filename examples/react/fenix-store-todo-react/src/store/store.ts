import { FenixStore } from '@bernaporto/fenix-store';
import type { TAppState, TTaskMap } from '../types';
import { StorePath } from './StorePath';
import { Storage } from './Storage';

const equals = (a: unknown, b: unknown): boolean => {
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;

    return a.every((item, index) => equals(item, b.at(index)));
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
    Object.keys(maybeTasks).forEach((id) => {
      store.on(StorePath.TASK(id)).set(maybeTasks[id]);
    });
  }

  // Subscribe to set the id list once items change
  store.on<TTaskMap>(StorePath.TASKS).subscribe((tasks) => {
    // Update the ids list
    store.on<string[]>(StorePath.TASK_IDS).set(
      Object.values(tasks)
        .sort((a, b) => Number(a.completed) - Number(b.completed))
        .map(({ id }) => id),
    );

    // Save to storage
    Storage.save(tasks);
  });

  return store;
};

export const store = getStore();

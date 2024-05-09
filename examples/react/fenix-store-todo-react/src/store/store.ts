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
      darkMode: false,
      tasks: {
        ids: [],
        items: {},
      },
      progress: {
        completed: 0,
        total: 0,
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

  // Subscribe to item changes
  store.on<TTaskMap>(StorePath.TASKS).subscribe((tasks) => {
    const taskList = Object.values(tasks);

    // 1. Save to storage
    Storage.save(tasks);

    // 2. Update the ids list
    store
      .on<string[]>(StorePath.TASK_IDS)
      .set(
        taskList
          .sort((a, b) => Number(a.completed) - Number(b.completed))
          .map(({ id }) => id),
      );

    // 3. Update total and completed tasks count
    store.on(StorePath.TOTAL).set(taskList.length);
    store
      .on(StorePath.COMPLETED)
      .set(taskList.filter((task) => task.completed).length);
  });

  return store;
};

export const store = getStore();

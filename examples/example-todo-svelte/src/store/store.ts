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
      darkMode: true,
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
  const maybeTasks = Storage.tasks.get();
  if (maybeTasks !== null) {
    Object.keys(maybeTasks).forEach((id) => {
      store.on(StorePath.TASK(id)).set(maybeTasks[id]);
    });
  }

  // Load dark mode from storage
  const maybeDarkMode = Storage.darkMode.get();
  if (maybeDarkMode !== null) {
    store.on(StorePath.DARK_MODE).set(maybeDarkMode);
  }

  // Subscribe to item changes
  store.on<TTaskMap>(StorePath.TASKS).subscribe((tasks) => {
    const taskList = Object.values(tasks);

    // 1. Save to storage
    Storage.tasks.save(tasks);

    // 2. Update the ids list
    store.on<string[]>(StorePath.TASK_IDS).set(taskList.map(({ id }) => id));

    // 3. Update total and completed tasks count
    store.on(StorePath.TOTAL).set(taskList.length);
    store
      .on(StorePath.COMPLETED)
      .set(taskList.filter((task) => task.completed).length);
  });

  // Subscribe to dark mode changes
  store.on<boolean>(StorePath.DARK_MODE).subscribe((darkMode) => {
    Storage.darkMode.save(darkMode);
  });

  return store;
};

export const store = getStore();

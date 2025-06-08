import { FenixStore } from 'fenix-store';
import type { TAppState } from '../types';
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
      store.on(`tasks.items.${id}`).set(maybeTasks[id]);
    });
  }

  // Load dark mode from storage
  const maybeDarkMode = Storage.darkMode.get();
  if (maybeDarkMode !== null) {
    store.on('darkMode').set(maybeDarkMode);
  }

  // Subscribe to item changes
  store.on('tasks.items').subscribe((tasks) => {
    const taskList = Object.values(tasks);

    // 1. Save to storage
    Storage.tasks.save(tasks);

    // 2. Update the ids list
    store.on('tasks.ids').set(taskList.map(({ id }) => id));

    // 3. Update total and completed tasks count
    store.on('progress.total').set(taskList.length);
    store
      .on('progress.completed')
      .set(taskList.filter((task) => task.completed).length);
  });

  // Subscribe to dark mode changes
  store.on('darkMode').subscribe((darkMode) => {
    Storage.darkMode.save(darkMode);
  });

  return store;
};

export const store = getStore();

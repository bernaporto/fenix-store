import { TTaskMap } from '../types';

const getKey = (key: string) => `fenix-store-todo-app.${key}`;

const getStorageHandler = <T>(key: string) =>
  Object.freeze({
    get: (): T | null => {
      try {
        const fromStorage = localStorage.getItem(key);
        return fromStorage ? JSON.parse(fromStorage) : null;
      } catch {
        return null;
      }
    },

    save: (state: T) => {
      localStorage.setItem(key, JSON.stringify(state));
    },
  });

const TasksStorage = getStorageHandler<TTaskMap>(getKey('tasks'));
const DarkModeStorage = getStorageHandler<boolean>(getKey('darkMode'));

export const Storage = Object.freeze({
  tasks: TasksStorage,
  darkMode: DarkModeStorage,
});

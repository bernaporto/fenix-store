import { TTaskMap } from '../types';

export const Storage = Object.freeze({
  STORAGE_KEY: 'fenix-store-todo',

  get: (): TTaskMap | null => {
    try {
      const fromStorage = localStorage.getItem(Storage.STORAGE_KEY);
      return fromStorage ? JSON.parse(fromStorage) : null;
    } catch {
      return null;
    }
  },

  save: (state: TTaskMap) => {
    localStorage.setItem(Storage.STORAGE_KEY, JSON.stringify(state));
  },
});

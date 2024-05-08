import type { TObservable } from '../../observable';
import type { TStoreObservable } from '../types';

export const toStoreObservable = <T>(
  observable: TObservable<T>,
): TStoreObservable<T> => ({
  get: observable.get,
  reset: observable.reset,
  subscribe: observable.subscribe,
  update: observable.update,
  set: (value) => observable.set(value),
});

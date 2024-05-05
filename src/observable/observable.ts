import type { TObservable, TObserver } from './types';
import { clone, equals, merge, type TUtils } from '@/utils';

export const observable = <T = unknown>(
  initialValue: T | null = null,
  utils: Partial<TUtils> = {}
): TObservable<T> => {
  const observers = new Set<TObserver<T>>();
  const tools = merge<TUtils>({ clone, equals }, utils);
  let value = tools.clone(initialValue);

  const self: TObservable<T> = {
    get: () => tools.clone(value),

    reset: () => {
      observers.clear();
      value = tools.clone(initialValue);
    },

    set: (next) => {
      if (tools.equals(value, next)) return;

      const previous = tools.clone(value);
      value = tools.clone(next);

      observers.forEach((observer) => {
        observer(tools.clone(next), tools.clone(previous));
      });
    },

    subscribe: (observer, notifyImmediately = false) => {
      observers.add(observer);

      if (notifyImmediately) {
        observer(tools.clone(value), null);
      }

      return () => {
        observers.delete(observer);
      };
    },

    update: (updater) => {
      const next = updater(value as T);
      self.set(next);
    },
  };

  return self;
};

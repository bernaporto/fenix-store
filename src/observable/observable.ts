import type { TObservable, TObserver } from './types';
import { clone } from '@/utils/clone';
import { equals } from '@/utils/equals';
import { merge } from '@/utils/merge';
import type { TUtils } from '@/utils/types';

export const observable = <T = unknown>(
  initialValue?: T,
  utils: Partial<TUtils> = {}
): TObservable<T> => {
  const observers = new Set<TObserver<T>>();
  const _utils = merge<TUtils>({ clone, equals }, utils);
  let value = _utils.clone(initialValue);

  const self: TObservable<T> = {
    clear: () => {
      observers.clear();
    },

    get: () => _utils.clone(value) as T,

    reset: () => {
      self.set(initialValue as T);
    },

    set: (next) => {
      if (_utils.equals(value, next)) return;

      const previous = self.get();
      value = _utils.clone(next);

      observers.forEach((observer) => {
        observer(_utils.clone(next), previous);
      });
    },

    subscribe: (observer, notifyImmediately = false) => {
      observers.add(observer);

      if (notifyImmediately) {
        observer(self.get());
      }

      return () => {
        observers.delete(observer);
      };
    },

    update: (updater) => {
      const next = updater(self.get());
      self.set(next);
    },

    observers: {
      get count() {
        return observers.size;
      },
    },
  };

  return self;
};

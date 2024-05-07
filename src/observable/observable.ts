import type {
  TObservable,
  TObservableConfig,
  TObserver,
  TUpdater,
} from './types';

export const observable = <T>(config: TObservableConfig<T>): TObservable<T> => {
  const { afterChange, beforeChange, log, utils } = config;
  const observers = new Set<TObserver<T>>();

  const initialValue = utils.clone(config.initialValue as T);
  let value = utils.clone(initialValue);

  const self = {
    get: () => utils.clone(value),

    subscribe: (observer: TObserver<T>, notifyImmediately = false) => {
      observers.add(observer);

      if (notifyImmediately) {
        observer(self.get());
      }

      return () => {
        observers.delete(observer);
      };
    },

    update: (updater: TUpdater<T>) => {
      const next = updater(self.get());
      self.set(next, 'update');
    },

    reset: () => {
      self.set(initialValue, 'reset');
    },

    set: (next: T, __internal__logkey__ = 'set') => {
      /* 1. Verify equality */
      if (utils.equals(value, next)) return;

      /* 2. Apply effects */
      const previous = self.get();
      const _next = beforeChange(next, previous);

      /* 3. Save new value */
      value = utils.clone(_next);

      /* 4. Notify observers & others */
      observers.forEach((observer) => {
        observer(utils.clone(_next), previous);
      });

      afterChange(_next, previous);

      /* 5. Log */
      log({
        key: __internal__logkey__,
        observers: observers.size,
        next: _next,
        previous: previous,
      });
    },

    observers: {
      get count() {
        return observers.size;
      },

      clear: () => {
        observers.clear();
      },

      remove: (observer: TObserver<T>) => {
        observers.delete(observer);
      },
    },
  };

  return self;
};

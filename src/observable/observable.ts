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

  const self: TObservable<T> = {
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
      self.set(next, { logKey: 'update' });
    },

    reset: () => {
      self.set(initialValue, { logKey: 'reset' });
    },

    set: (next, options = {}) => {
      const { logKey = 'set', skipEvents = false } = options;

      /* 1. Verify equality */
      if (utils.equals(value, next)) return;

      /* 2. Apply effects */
      const previous = self.get();
      const _next = !skipEvents ? beforeChange(next, previous) : next;

      /* 3. Save new value */
      value = utils.clone(_next);

      /* 4. Notify observers & others */
      observers.forEach((observer) => {
        observer(utils.clone(_next), previous);
      });

      !skipEvents && afterChange(_next, previous);

      /* 5. Log */
      log({
        key: logKey,
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

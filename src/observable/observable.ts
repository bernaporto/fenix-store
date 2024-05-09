import type {
  TObservable,
  TObservableConfig,
  TObserver,
  TUpdater,
} from './types';

export const observable = <T>(config: TObservableConfig<T>): TObservable<T> => {
  const { applyEffects, onChange, utils } = config;
  const observers = new Set<TObserver<T>>();

  const initialValue = utils.clone(config.initialValue as T);
  let value = utils.clone(initialValue);

  const self: TObservable<T> = {
    get: () => utils.clone(value),

    subscribe: (observer: TObserver<T>, notifyImmediately = true) => {
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
      const { cancelBubble, logKey = 'set' } = options;

      /* 1. Verify equality */
      if (utils.equals(value, next)) return;

      const previous = self.get();

      /* 2. Apply effects */
      const _next = applyEffects(next, previous);

      /* 3. Save new value */
      value = utils.clone(_next);

      /* 4. Notify observers & others */
      observers.forEach((observer) => {
        observer(utils.clone(_next), previous);
      });

      onChange({ cancelBubble, logKey, previous, next: _next });
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

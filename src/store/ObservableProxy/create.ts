import type { TObservableProxy, TObservableLike, TObserver } from './types';

type TObservableProxyConfig<T> = {
  getValue: () => T;
  setValue: (value: T) => void;
  reset: () => void;
};

export const create = <T>({
  reset,
  getValue,
  setValue,
}: TObservableProxyConfig<T>): TObservableProxy<T> => {
  const observers = new Set<TObserver<T>>();

  const observable: TObservableLike<T> = {
    get: () => {
      return getValue() as T;
    },

    reset: () => {
      reset();
    },

    set: (value) => {
      setValue(value);
    },

    subscribe: (observer, notifyImmediately = true) => {
      observers.add(observer);

      if (notifyImmediately) {
        observer(observable.get());
      }

      return () => {
        observers.delete(observer);
      };
    },

    update: (updater) => {
      observable.set(updater(observable.get()));
    },
  };

  return {
    observable,
    observers,
    notify: (value: T) => {
      observers.forEach((observer) => observer(value));
    },
  };
};

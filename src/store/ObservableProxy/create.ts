import type { TObservableProxy, TObservableLike, TObserver } from './types';

type TObservableProxyConfig<T> = {
  initialValue: T;
} & {
  getValue: () => T;
  setValue: (value: T, logKey?: string) => void;
};

export const create = <T>({
  initialValue,
  getValue,
  setValue,
}: TObservableProxyConfig<T>): TObservableProxy<T> => {
  const observers = new Set<TObserver<T>>();

  const observable: TObservableLike<T> = {
    get: () => {
      return getValue() as T;
    },

    reset: () => {
      setValue(initialValue, 'reset');
    },

    set: (value) => {
      setValue(value, 'set');
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
      setValue(updater(getValue()), 'update');
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

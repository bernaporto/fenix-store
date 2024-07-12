type TUpdater<T> = (value: T) => T;
type TUsubscriber = VoidFunction;
export type TObserver<T> = (value: T) => void;

export type TObservableLike<T> = {
  get: () => T;
  reset: () => void;
  set: (value: T) => void;
  subscribe: (
    observer: TObserver<T>,
    notifyImmediately?: boolean,
  ) => TUsubscriber;
  update: (updater: TUpdater<T>) => void;
};

export type TObservableProxy<T> = {
  observable: TObservableLike<T>;
  observers: Set<TObserver<T>>;
} & {
  notify: (value: T) => void;
};

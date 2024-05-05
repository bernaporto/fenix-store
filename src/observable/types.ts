export type TObserver<T> = (value: T | null, previous: T | null) => void;
type TUpdater<T> = (value: T) => T;

export type TObservable<T = unknown> = {
  get: () => T | null;
  set: (value: T) => void;
  subscribe: (
    observer: TObserver<T>,
    notifyImmediately?: boolean
  ) => VoidFunction;
  update: (updater: TUpdater<T>) => void;
} & {
  reset: VoidFunction;
};

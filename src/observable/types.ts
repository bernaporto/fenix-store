export type TObserver<T> = (value: T, previous?: T) => void;
type TUpdater<T> = (value: T) => T;

export type TObservable<T = unknown> = {
  get: () => T;
  set: (value: T) => void;
  subscribe: (
    observer: TObserver<T>,
    notifyImmediately?: boolean
  ) => VoidFunction;
  update: (updater: TUpdater<T>) => void;
} & {
  dispose: VoidFunction;
  reset: VoidFunction;
};

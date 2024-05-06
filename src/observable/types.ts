export type TObserver<T> = (value: Readonly<T>, previous?: Readonly<T>) => void;
type TUpdater<T> = (value: Readonly<T>) => T;

export type TObservable<T = unknown> = {
  get: () => Readonly<T>;
  set: (value: T) => void;
  subscribe: (
    observer: TObserver<T>,
    notifyImmediately?: boolean
  ) => VoidFunction;
  update: (updater: TUpdater<T>) => void;
} & {
  clear: VoidFunction;
  reset: VoidFunction;
  observers: {
    count: number;
  };
};

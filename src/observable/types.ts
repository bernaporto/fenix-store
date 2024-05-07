import { TUtils } from '@/utils/types';

export type TObserver<T> = (value: Readonly<T>, previous?: Readonly<T>) => void;
export type TUpdater<T> = (value: Readonly<T>) => T;

type TObserverHandler = {
  count: number;
  clear: VoidFunction;
} & {
  remove: (observer: TObserver<unknown>) => void;
};

export type TObservable<T = unknown> = {
  get: () => Readonly<T>;
  set: (value: T) => void;
  subscribe: (
    observer: TObserver<T>,
    notifyImmediately?: boolean,
  ) => VoidFunction;
  update: (updater: TUpdater<T>) => void;
} & {
  reset: VoidFunction;
  observers: TObserverHandler;
};

type TLogConfig = {
  key: string;
  observers: number;
  next: unknown;
  previous: unknown;
};

export type TObservableConfig<T> = {
  utils: TUtils;
  initialValue?: T;
} & {
  afterChange: (next: T, previous?: T) => void;
  beforeChange: (next: T, previous?: T) => T;
  log: (config: TLogConfig) => void;
};

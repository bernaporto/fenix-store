import { TUtils } from '@/utils/types';

export type TObserver<T> = (value: Readonly<T>, previous?: Readonly<T>) => void;
export type TUpdater<T> = (value: Readonly<T>) => T;

type TObserverHandler = {
  count: number;
  clear: VoidFunction;
} & {
  remove: (observer: TObserver<unknown>) => void;
};

type TSetOptions = {
  logKey?: string;
  cancelBubble?: boolean;
};

export type TObservable<T = unknown> = {
  get: () => Readonly<T>;
  set: (value: T, options?: TSetOptions) => void;
  subscribe: (
    observer: TObserver<T>,
    notifyImmediately?: boolean,
  ) => VoidFunction;
  update: (updater: TUpdater<T>) => void;
} & {
  reset: VoidFunction;
  observers: TObserverHandler;
};

type TChangeEvent = {
  logKey: string;
  next: unknown;
  previous: unknown;
  cancelBubble?: boolean;
};

export type TObservableConfig<T> = {
  utils: TUtils;
  initialValue?: T;
} & {
  applyEffects: (next: T, previous: T) => T;
  onChange: (event: TChangeEvent) => void;
};

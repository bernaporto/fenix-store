import type { TObservable } from '@/observable';
import type { TUtils } from '@/utils/types';

export type TState = Record<string, unknown>;
export type TStoreEffect = (
  path: string,
  next: unknown,
  previous?: unknown
) => unknown | void;

export type TStore<State extends TState> = {
  for: <T>(path: string) => TObservable<T>;
  get: () => State;
} & {
  dispose: VoidFunction;
  reset: VoidFunction;
};

export type TStoreConfig = {
  utils?: Partial<TUtils>;
  effects?: TStoreEffect[];
};

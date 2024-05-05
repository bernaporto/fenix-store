import type { TObservable } from '@/observable';
import type { TUtils } from '@/utils/types';

export type TState = Record<string, unknown>;
export type TStoreEffect = (
  path: string,
  value: unknown,
  previous?: unknown
) => { next: unknown } | void;

export type TStoreObservable<T> = Pick<
  TObservable<T>,
  'get' | 'reset' | 'set' | 'subscribe' | 'update'
>;

export type TStore<State extends TState> = {
  for: <T>(path: string) => TStoreObservable<T>;
  get: () => State;
} & {
  clear: VoidFunction;
  reset: VoidFunction;
};

export type TStoreConfig = {
  debug: boolean;
  effects: TStoreEffect[];
  utils: TUtils;
  debugKey?: string;
};

export type TObContainer = {
  $original: TObservable<unknown>;
  storeOb: TStoreObservable<unknown>;
};

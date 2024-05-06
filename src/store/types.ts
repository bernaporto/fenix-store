import type { TObservable } from '@/observable';
import type { TUtils } from '@/utils/types';

export type TState = Record<string, unknown>;
export type TStoreEffect = (
  path: string,
  value: unknown,
  previous?: unknown
) => { next: unknown } | void;

export type TStore<State extends TState> = {
  for: <T>(path: string) => TObservable<T>;
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

export type TObProxyContainer = {
  original: TObservable<unknown>;
  proxy: TObservable<unknown>;
};

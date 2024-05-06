import type { TObservable } from '@/observable';
import type { TUtils } from '@/utils/types';

type TEffectManager = {
  use: (effect: TStoreEffect) => void;
};

export type TExtendedEffectManager = TEffectManager & {
  list: () => TStoreEffect[];
} & {
  clear: VoidFunction;
};

export type TState = Record<string, unknown>;
export type TStoreEffect = (
  path: string,
  value: unknown,
  previous?: unknown,
) => { next: unknown } | void;

export type TStore<State extends TState> = {
  on: <T>(path: string) => TObservable<T>;
  get: () => State;
} & {
  clear: VoidFunction;
  effects: TEffectManager;
  reset: VoidFunction;
};

export type TStoreConfig = {
  debug: boolean;
  utils: TUtils;
  debugKey?: string;
};

export type TObProxyContainer = {
  original: TObservable<unknown>;
  proxy: TObservable<unknown>;
};

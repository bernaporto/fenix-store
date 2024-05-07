import type { TObservable } from '@/observable';
import type { TUtils } from '@/utils/types';

/* STORE */
type TEffectManager = {
  use: <T = unknown>(effect: TStoreEffect<T>) => void;
};

export type TExtendedEffectManager = TEffectManager & {
  list: () => TStoreEffect[];
} & {
  clear: VoidFunction;
};

export type TState = Record<string, unknown>;
export type TStoreEffect<T = unknown> = (
  path: string,
  value: T,
  previous?: T,
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

export type TOptionalStoreConfig = Omit<Partial<TStoreConfig>, 'utils'> & {
  utils?: Partial<TUtils>;
};

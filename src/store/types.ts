import type { TUtils } from '@/utils/types';
import type { TObservableLike } from './ObservableProxy/types';
import { TEffectHandler } from './EffectManager/types';

/* STORE */

export type TState = Record<string, unknown>;

export type TStoreObservable<T> = TObservableLike<T>;

export type TStore<State extends TState> = {
  on: <T>(path: string) => TStoreObservable<T>;
  get: () => State;
} & {
  clear: VoidFunction;
  effects: TEffectHandler;
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

import type {
  TObservableController,
  TObservableLike,
} from './ObservableController/types';
import { TEffectHandler } from './EffectManager/types';
import { Get, Paths } from '@/tools/types';

export type TState = Record<string, unknown>;

export type TStoreObservable<T> = TObservableLike<T>;

export type TStore<State extends TState> = {
  on: <Path extends Paths<State>>(
    path: Path,
  ) => TStoreObservable<Get<State, Path>>;
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

export type TUtils = {
  clone: <T>(value: T) => T;
  equals: (a: unknown, b: unknown) => boolean;
};

export type TCacheItem = {
  controller: TObservableController<unknown>;
  parsedPath: string[];
};

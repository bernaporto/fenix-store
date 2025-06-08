import type { TStore, TState } from './Store';
import type { Get, Paths } from './tools/types';

export type FenixStore<T extends TState> = TStore<T>;

export type TStorePaths<T extends TState> = Paths<T>;
export type TGetStoreValue<T extends TState, Path extends TStorePaths<T>> = Get<
  T,
  Path
>;

export { FenixStore, type TStoreObservable } from './Store';

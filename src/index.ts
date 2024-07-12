import type { TStore, TState } from './store';

export type TFenixStore<T extends TState> = TStore<T>;
export type FenixStore<T extends TState> = TStore<T>;
export { FenixStore, type TStoreObservable } from './store';

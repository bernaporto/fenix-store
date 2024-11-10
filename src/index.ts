import type { TStore, TState } from './Store';

export type FenixStore<T extends TState> = TStore<T>;
export { FenixStore, type TStoreObservable } from './Store';

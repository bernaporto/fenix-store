import { TStore, TState } from './store';

export type FenixStore<T extends TState> = TStore<T>;
export { FenixStore } from './store';

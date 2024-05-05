import type { TObservable } from '@/observable';

export type TState = Record<string, unknown>;

export type TStore<State extends TState> = {
  for: <T>(path: string) => TObservable<T>;
  get: () => State;
} & {
  dispose: VoidFunction;
  reset: VoidFunction;
};

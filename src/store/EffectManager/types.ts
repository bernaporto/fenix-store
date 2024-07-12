export type TEffectHandler = {
  clear: () => void;
  list: () => TStoreEffect[];
  use: <T = unknown>(effect: TStoreEffect<T>) => void;
};

export type TEffectManager = {
  apply: (path: string, next: unknown, previous: unknown) => unknown;
  handler: TEffectHandler;
};

export type TStoreEffect<T = unknown> = (
  path: string,
  value: T,
  previous?: T,
) => { next: unknown } | void;

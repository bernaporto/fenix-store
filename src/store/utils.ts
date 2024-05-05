import { deletePath, getFromPath, setAtPath } from '@/utils/path';
import { observable } from '@/observable';
import type { TUtils } from '@/utils/types';
import type { TState, TStoreEffect } from './types';

export const getObservable = (
  path: string,
  state: TState,
  utils: TUtils,
  effects?: TStoreEffect[]
) => {
  const ob = observable(getFromPath(path, state), utils);
  const originalSet = ob.set;

  ob.set = (value: unknown) => {
    const next = effects
      ? applyEffects(path, value, getFromPath(path, state), effects, utils)
      : value;

    originalSet(next);
  };

  ob.subscribe((value) => {
    if (value === undefined) {
      deletePath(path, state);
      return;
    }

    setAtPath(path, value, state);
  });

  return ob;
};

const applyEffects = (
  path: string,
  next: unknown,
  previous: unknown,
  effects: TStoreEffect[],
  utils: TUtils
) =>
  effects.reduce<unknown>(
    (acc, effect) =>
      effect(path, utils.clone(acc), utils.clone(previous)) ?? acc,
    next
  );

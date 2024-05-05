import { deletePath, getFromPath, setAtPath } from '@/utils/path';
import { observable, type TObservable } from '@/observable';
import type { TUtils } from '@/utils/types';
import type { TObContainer, TState, TStoreEffect } from './types';

export const setupObservable = (
  path: string,
  state: TState,
  obMap: Map<string, TObContainer>,
  utils: TUtils,
  effects?: TStoreEffect[]
): TObContainer => {
  const initialValue = getFromPath(path, state);
  const ob = observable(initialValue, utils);
  const originalReset = ob.reset;

  ob.reset = () => {
    originalReset();
    setAtPath(path, ob.get(), state);
  };

  return {
    $original: ob,
    storeOb: toStoreOb(ob, path, state, obMap, utils, effects),
  };
};

const toStoreOb = (
  ob: TObservable<unknown>,
  path: string,
  state: TState,
  obMap: Map<string, TObContainer>,
  utils: TUtils,
  effects?: TStoreEffect[]
) => {
  return {
    get: ob.get,
    reset: ob.reset,
    subscribe: ob.subscribe,
    update: ob.update,

    set: (value: unknown) => {
      const next = effects
        ? applyEffects(path, value, getFromPath(path, state), effects, utils)
        : value;

      if (next === undefined) {
        deletePath(path, state);
      } else {
        setAtPath(path, utils.clone(next), state);
      }

      ob.set(next);

      // update all observables that are affected by this change
      Array.from(obMap.keys())
        .filter((p) => p !== path && (path.startsWith(p) || p.startsWith(path)))
        .forEach((p) => {
          obMap.get(p)?.$original.set(getFromPath(p, state));
        });
    },
  };
};

const applyEffects = (
  path: string,
  next: unknown,
  previous: unknown,
  effects: TStoreEffect[],
  utils: TUtils
) =>
  effects.reduce<unknown>(
    (acc, effect) => {
      const result = effect(path, utils.clone(acc), utils.clone(previous));

      if (result === undefined) {
        return acc;
      }

      return result.next;
    },

    next
  );

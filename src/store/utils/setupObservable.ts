import { observable, type TObservable } from '@/observable';
import { getFromPath, deletePath, setAtPath } from '@/utils/path';
import type {
  TState,
  TStoreConfig,
  TExtendedEffectManager,
} from '@/store/types';
import { applyEffects } from './effects';
import { log } from './log';

export const setupObservable = (
  path: string,
  state: TState,
  obMap: Map<string, TObservable<unknown>>,
  config: TStoreConfig,
  effects: TExtendedEffectManager,
): TObservable<unknown> => {
  const { debug, debugKey, utils } = config;

  return observable({
    utils,

    initialValue: getFromPath(path, state),

    beforeChange: (next, previous) => {
      /* Apply effects */
      return applyEffects(path, next, previous, config, effects);
    },

    afterChange: (next) => {
      /* Update state */
      if (next === undefined) {
        deletePath(path, state);
      } else {
        setAtPath(path, config.utils.clone(next), state);
      }

      /* Notify other affected observables */
      Array.from(obMap.keys())
        .filter((p) => p !== path && (path.startsWith(p) || p.startsWith(path)))
        .forEach((p) => {
          obMap.get(p)?.set(getFromPath(p, state), { skipEvents: true });
        });
    },

    log: ({ next, observers, previous, key }) => {
      if (!debug) return;

      log({
        observers,
        path,
        baseMsg: getDebugMessage(`store.${key}`, debugKey),
        next: utils.clone(next),
        previous: utils.clone(previous),
      });
    },
  });
};

const getDebugMessage = (action: string, key?: string) => {
  return [key && `[${key}]`, action].filter(Boolean).join(' ');
};

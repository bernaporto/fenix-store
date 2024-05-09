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

  const ob = observable({
    utils,

    initialValue: getFromPath(path, state),

    applyEffects: (next, previous) => {
      return applyEffects(path, next, previous, config, effects);
    },

    onChange: ({ logKey, next, previous, cancelBubble = false }) => {
      /* Update state */
      if (next === undefined) {
        deletePath(path, state);
      } else {
        setAtPath(path, config.utils.clone(next), state);
      }

      if (cancelBubble) return;

      /* Log */
      if (debug) {
        log({
          path,
          observers: ob.observers.count,
          baseMsg: getDebugMessage(`store.${logKey}`, debugKey),
          next: utils.clone(next),
          previous: utils.clone(previous),
        });
      }

      /* Notify other affected observables */
      Array.from(obMap.keys())
        .filter((p) => p !== path && (path.startsWith(p) || p.startsWith(path)))
        .forEach((p) => {
          obMap.get(p)?.set(getFromPath(p, state), { cancelBubble: true });
        });
    },
  });

  return ob;
};

const getDebugMessage = (action: string, key?: string) => {
  return [key && `[${key}]`, action].filter(Boolean).join(' ');
};

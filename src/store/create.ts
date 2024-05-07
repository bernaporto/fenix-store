import type { TObservable } from '@/observable';
import { ensureConfig, getEffectManager, setupObservable } from './utils';
import type { TOptionalStoreConfig, TState, TStore } from './types';

export const create = <State extends TState = TState>(
  initialValue: State = Object.create(null),
  config?: TOptionalStoreConfig,
): TStore<State> => {
  const effects = getEffectManager();
  const obMap = new Map<string, TObservable<unknown>>();

  const _config = ensureConfig(config);
  const state = _config.utils.clone(initialValue);

  return {
    clear: () => {
      obMap.forEach((ob) => {
        ob.observers.clear();
      });

      effects.clear();
      obMap.clear();
    },

    on: <T>(path: string) => {
      let ob = obMap.get(path);

      if (!ob) {
        ob = setupObservable(path, state, obMap, _config, effects);

        obMap.set(path, ob);
      }

      return ob as TObservable<T>;
    },

    get: () => {
      return state as State;
    },

    reset: () => {
      obMap.forEach((ob) => {
        ob.reset();
      });
    },

    effects: {
      use: effects.use,
    },
  };
};

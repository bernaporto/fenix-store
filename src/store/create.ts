import { clone } from '@/utils/clone';
import { equals } from '@/utils/equals';
import { merge } from '@/utils/merge';
import type { TObservable } from '@/observable';
import type { TUtils } from '@/utils/types';
import type { TObProxyContainer, TState, TStore, TStoreConfig } from './types';
import { getEffectManager } from './effects';
import { setupObservable } from './utils';

type TOptionalStoreConfig = Omit<Partial<TStoreConfig>, 'utils'> & {
  utils?: Partial<TUtils>;
};

const defaultConfig: TStoreConfig = {
  utils: { clone, equals },
  debug: false,
};

const create = <State extends TState = TState>(
  initialValue: State = Object.create(null),
  config?: TOptionalStoreConfig,
): TStore<State> => {
  const effects = getEffectManager();
  const obMap = new Map<string, TObProxyContainer>();

  const _config = merge<TStoreConfig>(defaultConfig, config);
  const state = _config.utils.clone(initialValue);

  return {
    clear: () => {
      obMap.forEach((ob) => {
        ob.proxy.observers.clear();
      });

      effects.clear();
      obMap.clear();
    },

    on: <T>(path: string) => {
      let container = obMap.get(path);

      if (!container) {
        container = setupObservable(path, state, obMap, _config, effects);

        obMap.set(path, container);
      }

      return container.proxy as TObservable<T>;
    },

    get: () => {
      return state as State;
    },

    reset: () => {
      obMap.forEach((ob) => {
        ob.proxy.reset();
      });
    },

    effects: {
      use: effects.use,
    },
  };
};

export { create };

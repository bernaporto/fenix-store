import { clone } from '@/utils/clone';
import { equals } from '@/utils/equals';
import { merge } from '@/utils/merge';
import type { TUtils } from '@/utils/types';
import type {
  TObContainer,
  TState,
  TStore,
  TStoreConfig,
  TStoreObservable,
} from './types';
import { setupObservable } from './utils';

type TOptionalStoreConfig = Omit<Partial<TStoreConfig>, 'utils'> & {
  utils?: Partial<TUtils>;
};

const defaultConfig: TStoreConfig = {
  utils: { clone, equals },
  effects: [],
  debug: false,
};

const create = <State extends TState = TState>(
  initialValue: State = Object.create(null),
  config?: TOptionalStoreConfig
): TStore<State> => {
  const _config = merge<TStoreConfig>(defaultConfig, config);
  const state = _config.utils.clone(initialValue);
  const obMap = new Map<string, TObContainer>();

  return {
    clear: () => {
      obMap.forEach((ob) => {
        ob.$original.clear();
      });

      obMap.clear();
    },

    for: <T>(path: string) => {
      let container = obMap.get(path);

      if (!container) {
        container = setupObservable(path, state, obMap, _config);

        obMap.set(path, container);
      }

      return container.storeOb as TStoreObservable<T>;
    },

    get: () => {
      return state as State;
    },

    reset: () => {
      obMap.forEach((ob) => {
        ob.$original.reset();
      });
    },
  };
};

export { create };

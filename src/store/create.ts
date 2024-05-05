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

const create = <State extends TState = TState>(
  initialValue: State = Object.create(null),
  config?: TStoreConfig
): TStore<State> => {
  const _utils = merge<TUtils>({ clone, equals }, config?.utils);
  const state = _utils.clone(initialValue);
  const obMap = new Map<string, TObContainer>();

  return {
    dispose: () => {
      obMap.forEach((ob) => {
        ob.$original.dispose();
      });

      obMap.clear();
    },

    for: <T>(path: string) => {
      let container = obMap.get(path);

      if (!container) {
        container = setupObservable(
          path,
          state,
          obMap,
          _utils,
          config?.effects
        );

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

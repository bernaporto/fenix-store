import { clone } from '@/utils/clone';
import { equals } from '@/utils/equals';
import { merge } from '@/utils/merge';
import type { TObservable } from '@/observable/types';
import type { TUtils } from '@/utils/types';
import type { TState, TStore, TStoreConfig } from './types';
import { setupObservable, patchObservable } from './utils';

const create = <State extends TState = TState>(
  initialValue: State = Object.create(null),
  config?: TStoreConfig
): TStore<State> => {
  const _utils = merge<TUtils>({ clone, equals }, config?.utils);
  const state = _utils.clone(initialValue);
  const obMap = new Map<string, TObservable<unknown>>();

  return {
    dispose: () => {
      obMap.forEach((ob) => {
        ob.dispose();
      });

      obMap.clear();
    },

    for: (path) => {
      let ob = obMap.get(path);

      if (!ob) {
        ob = setupObservable(path, state, _utils);
        obMap.set(path, ob);
      }

      return patchObservable(ob, path, state, obMap, _utils, config?.effects);
    },

    get: () => {
      return state as State;
    },

    reset: () => {
      obMap.forEach((ob) => {
        ob.reset();
      });
    },
  };
};

export { create };

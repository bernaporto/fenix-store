import { clone } from '@/utils/clone';
import { equals } from '@/utils/equals';
import { merge } from '@/utils/merge';
import type { TObservable } from '@/observable/types';
import type { TUtils } from '@/utils/types';
import type { TState, TStore, TStoreConfig } from './types';
import { getObservable } from './utils';

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

    for: <T>(path: string) => {
      if (!obMap.has(path)) {
        const ob = getObservable(path, state, _utils, config?.effects);
        obMap.set(path, ob);
      }

      return obMap.get(path) as TObservable<T>;
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

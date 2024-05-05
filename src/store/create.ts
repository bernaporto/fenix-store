import { clone } from '@/utils/clone';
import { deletePath, getFromPath, setAtPath } from '@/utils/path';
import { equals } from '@/utils/equals';
import { merge } from '@/utils/merge';
import { observable } from '@/observable';
import type { TObservable } from '@/observable/types';
import type { TUtils } from '@/utils/types';
import type { TState, TStore } from './types';

const create = <State extends TState = TState>(
  initialValue: State = {} as State,
  utils: Partial<TUtils> = {}
): TStore<State> => {
  const _utils = merge<TUtils>({ clone, equals }, utils);
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
        const ob = observable(getFromPath(path, state), _utils);
        obMap.set(path, ob);

        ob.subscribe((value) => {
          if (value === undefined) {
            deletePath(path, state);
            return;
          }

          setAtPath(path, value, state);
        });
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

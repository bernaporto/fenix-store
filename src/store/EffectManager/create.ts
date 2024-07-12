import { isNotNullable } from '@/utils/nullable';
import { TUtils } from '../types';
import type { TEffectManager, TEffectHandler, TStoreEffect } from './types';

export const create = (utils: TUtils): TEffectManager => {
  const effects = new Set<TStoreEffect>();

  const handler: TEffectHandler = {
    clear: () => {
      effects.clear();
    },

    list: () => Array.from(effects),

    use: (effect) => {
      effects.add(effect as TStoreEffect<unknown>);
    },
  };

  return {
    handler,

    apply: (path, next, previous) => {
      const effectList = handler.list();

      if (effectList.length === 0) return next;

      return effectList.reduce<unknown>(
        (acc, effect) => {
          const result = effect(path, utils.clone(acc), utils.clone(previous));

          if (isNotNullable(result) && 'next' in result) {
            return result.next;
          }

          return acc;
        },

        next,
      );
    },
  };
};

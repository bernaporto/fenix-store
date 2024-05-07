import { isNotNullable } from '@/utils/nullable';
import type {
  TExtendedEffectManager,
  TStoreConfig,
  TStoreEffect,
} from '../types';

export const getEffectManager = (): TExtendedEffectManager => {
  const effects = new Set<TStoreEffect>();

  return {
    clear: () => {
      effects.clear();
    },

    list: () => Array.from(effects),

    use: (effect) => {
      effects.add(effect);
    },
  };
};

export const applyEffects = (
  path: string,
  next: unknown,
  previous: unknown,
  config: TStoreConfig,
  effects: TExtendedEffectManager,
) => {
  const { utils } = config;
  const effectList = effects.list();

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
};

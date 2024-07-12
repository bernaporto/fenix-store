import { clone } from '@/utils/clone';
import { equals } from '@/utils/equals';
import { merge } from '@/utils/merge';
import type { TOptionalStoreConfig, TStoreConfig } from '../types';

const defaultConfig: TStoreConfig = {
  utils: { clone, equals },
  debug: false,
};

export const ensureConfig = (config?: TOptionalStoreConfig): TStoreConfig =>
  merge<TStoreConfig>(defaultConfig, config);

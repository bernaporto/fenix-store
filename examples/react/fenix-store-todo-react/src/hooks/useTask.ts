import { StorePath } from '../store';
import type { TTaskItem } from '../types';
import { useStore } from './useStore';

export const useTask = (id: string) => useStore<TTaskItem>(StorePath.TASK(id));

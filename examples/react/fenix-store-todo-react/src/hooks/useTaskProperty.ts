import { StorePath } from '../store';
import type { TTaskItem } from '../types';
import { useStore } from './useStore';

export const useTaskProperty = <T extends keyof TTaskItem>(
  id: string,
  property: T,
) => {
  const path = `${StorePath.TASK(id)}.${property}`;
  const ob = useStore<TTaskItem[T]>(path);

  return {
    value: ob.value,
    set: ob.set,
  };
};

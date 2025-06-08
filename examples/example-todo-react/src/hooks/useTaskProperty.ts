import type { TTaskItem } from '../types';
import { useStore } from './useStore';

export const useTaskProperty = <K extends keyof TTaskItem>(
  id: string,
  property: K,
) => {
  const ob = useStore(`tasks.items.${id}.${property}`);

  return {
    value: ob.value,
    set: ob.set,
  };
};

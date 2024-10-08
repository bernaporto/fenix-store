import { StorePath } from '../store';
import { useStore } from './useStore';

export const useTaskList = () => {
  const { value: ids } = useStore<string[]>(StorePath.TASK_IDS);

  return ids;
};

import { useStore } from './useStore';

export const useTaskList = () => {
  const { value: ids } = useStore('tasks.ids');

  return ids;
};

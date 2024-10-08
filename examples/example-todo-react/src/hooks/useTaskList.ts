import { StorePath, store } from '../store';
import { TTaskItem } from '../types';
import { useStore } from './useStore';

export const useTaskList = () => {
  const { value: ids } = useStore<string[]>(StorePath.TASK_IDS);

  return {
    ids,
    add: addTask,
  };
};

const addTask = (label: string) => {
  const id = Date.now().toString();

  store.on<TTaskItem>(StorePath.TASK(id)).set({
    id,
    label,
    completed: false,
  });
};

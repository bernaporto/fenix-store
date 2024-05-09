import { StorePath, store } from '../store';
import { TTaskItem } from '../types';
import { useStore } from './useStore';

export const useTaskList = () => {
  const { data: ids } = useStore<string[]>(StorePath.TASK_IDS);

  return {
    ids,
    add: addTask,
    delete: deleteTask,
  };
};

const addTask = (label: string) => {
  const id = Date.now().toString();

  store.on<TTaskItem>(StorePath.TASK(id)).set({
    completed: false,
    id: Date.now().toString(),
    label,
  });
};

const deleteTask = (id: string) => store.on(StorePath.TASK(id)).reset();

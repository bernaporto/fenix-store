import { StorePath, store } from '../store';
import { TTaskItem } from '../types';
import { useStore } from './useStore';

export const useTaskList = () => {
  const taskIds = useStore<string[]>(StorePath.TASK_IDS);

  return {
    add: addTask,
    delete: deleteTask,
    ids: taskIds.data,
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

import { useCallback } from 'react';
import { store, StorePath } from '../store';

export const useDeleteTask = (id: string) =>
  useCallback(() => store.on(StorePath.TASK(id)).reset(), [id]);

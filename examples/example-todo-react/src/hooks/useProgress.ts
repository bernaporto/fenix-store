import { useStore } from './useStore';

export const useProgress = () => {
  const { value: completed } = useStore('progress.completed');
  const { value: total } = useStore('progress.total');

  return total ? (completed / total) * 100 : 0;
};

export const useTotal = () => {
  const { value: total } = useStore('progress.total');

  return total;
};

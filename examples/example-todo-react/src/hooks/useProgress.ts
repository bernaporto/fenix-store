import { StorePath } from '../store';
import { useStore } from './useStore';

export const useProgress = () => {
  const { value: completed } = useStore<number>(StorePath.COMPLETED);
  const { value: total } = useStore<number>(StorePath.TOTAL);

  return total ? (completed / total) * 100 : 0;
};

export const useTotal = () => {
  const { value: total } = useStore<number>(StorePath.TOTAL);

  return total;
};

import { StorePath } from '../store';
import { useStore } from './useStore';

export const useDarkMode = () => {
  const ob = useStore<boolean>(StorePath.DARK_MODE);

  return {
    darkMode: ob.value,
    toggleDarkMode: () => ob.update((curr) => !curr),
  };
};

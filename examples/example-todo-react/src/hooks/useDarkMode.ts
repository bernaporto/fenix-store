import { StorePath } from '../store';
import { useStore } from './useStore';

export const useDarkMode = () => {
  const { value: darkMode } = useStore<boolean>(StorePath.DARK_MODE);

  return darkMode;
};

import { useStore } from './useStore';

export const useDarkMode = () => {
  const { value: darkMode } = useStore('darkMode');

  return darkMode;
};

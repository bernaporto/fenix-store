import { Switch } from '../lib/Switch';
import { useDarkMode } from '../hooks';

export const AppHeader: React.FC = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <header className="w-full p-4 mb-2 flex items-center">
      <p className="flex-1 text-sm text-gray-500">
        Fenix Store Example - Todo App (React)
      </p>

      <article className="flex items-center gap-3 text-lg">
        <i className="bi bi-sun" />
        <Switch checked={darkMode} onClick={toggleDarkMode} />
        <i className="bi bi-moon" />
      </article>
    </header>
  );
};

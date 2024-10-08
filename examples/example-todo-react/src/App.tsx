import { AppBody } from './components/AppBody';
import { AppFooter } from './components/AppFooter';
import { AppHeader } from './components/AppHeader';
import { classNames } from './utils/classNames';
import { useDarkMode } from './hooks';

function App() {
  const darkMode = useDarkMode();

  return (
    <div
      className={classNames(
        'w-full h-full flex flex-col',
        'bg-gray-100 dark:bg-gray-900',
        'text-gray-700 dark:text-gray-300',
        {
          dark: darkMode,
        },
      )}
    >
      <AppHeader />
      <AppBody />
      <AppFooter />
    </div>
  );
}

export default App;

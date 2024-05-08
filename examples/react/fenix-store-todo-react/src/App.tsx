import { classNames } from './utils/classNames';
import { Container } from './lib/Container';
import { Header } from './components/Header';
import { TaskInput } from './components/TaskInput';
import { TaskList } from './components/TaskList';

function App() {
  return (
    <main
      className={classNames(
        'w-full h-full',
        'bg-gray-100 dark:bg-gray-900',
        'text-gray-700 dark:text-gray-300',
        {
          dark: true,
        },
      )}
    >
      <Container>
        <Header />
        <TaskInput />
        <TaskList />
      </Container>
    </main>
  );
}

export default App;

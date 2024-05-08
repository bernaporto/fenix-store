import { Container } from './lib/Container';
import { Header } from './components/Header';
import { Input } from './lib/Input';
import { TodoList } from './components/TodoList';

function App() {
  return (
    <main className="w-full h-full dark:bg-gray-800 dark">
      <Container>
        <Header />
        <Input />
        <TodoList />
      </Container>
    </main>
  );
}

export default App;

import { classNames } from '../utils/classNames';
import { TaskInput } from './TaskInput';
import { TaskList } from './TaskList';
import { TaskListHeader } from './TaskListHeader';

export const AppBody: React.FC = () => {
  return (
    <main className={classNames('w-full flex-1 overflow-y-auto')}>
      <section className="max-w-md h-full m-auto flex flex-col gap-6">
        <TaskListHeader />
        <TaskInput />
        <TaskList />
      </section>
    </main>
  );
};

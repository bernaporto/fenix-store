import { classNames } from '../utils/classNames';
import { TaskInput } from './TaskInput';
import { TaskList } from './TaskList';
import { TaskListHeader } from './TaskListHeader';

export const AppBody: React.FC = () => {
  return (
    <main className={classNames('w-full flex-1 overflow-y-auto')}>
      <section className="max-w-lg h-full m-auto p-8 flex flex-col gap-8">
        <TaskListHeader />
        <TaskInput />
        <TaskList />
      </section>
    </main>
  );
};

import { useTaskList } from '../hooks';
import { TaskItem } from './TaskItem';

export const TaskList: React.FC = () => {
  const tasks = useTaskList();

  return (
    <section className="flex-1 flex flex-col gap-3 overflow-y-auto">
      {tasks.map((taskId) => (
        <TaskItem key={taskId} id={taskId} />
      ))}
    </section>
  );
};

import { useTaskList } from '../hooks/useTaskList';
import { TaskItem } from './TaskItem';

export const TaskList: React.FC = () => {
  const tasks = useTaskList();
  return (
    <section className="flex-1 flex flex-col gap-4 overflow-y-auto">
      {tasks.ids.map((taskId) => (
        <TaskItem key={taskId} id={taskId} />
      ))}
    </section>
  );
};

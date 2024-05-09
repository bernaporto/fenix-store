import { Card } from '../lib/Card';
import { RadialProgressBar } from '../lib/RadialProgress';
import { useProgress } from '../hooks';

export const TaskListHeader: React.FC = () => {
  const { percetage, total } = useProgress();

  return (
    <Card className="px-10 py-4 flex items-center gap-4">
      <section className="flex-1">
        <h1>Task List</h1>
        <h5 className="flex gap-2 items-center">
          <i className="bi bi-check-circle text-lg" />
          <span>{total} tasks</span>
        </h5>
      </section>

      <RadialProgressBar className="w-28 h-28" progress={percetage}>
        <h3>{Math.round(percetage)}%</h3>
      </RadialProgressBar>
    </Card>
  );
};

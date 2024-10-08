import { Card } from '../lib/Card';
import { RadialProgressBar } from '../lib/RadialProgressBar';
import { useProgress, useTotal } from '../hooks';

export const TaskListHeader: React.FC = () => (
  <Card className="px-10 py-4 flex items-center gap-4">
    <section className="flex-1">
      <h1>Task List</h1>
      <h5 className="flex gap-2 items-center">
        <i className="bi bi-check-circle text-lg" />
        <TotalTasksLabel />
      </h5>
    </section>

    <ProgressBar />
  </Card>
);

const TotalTasksLabel: React.FC = () => {
  const total = useTotal();

  return <span>{total} tasks</span>;
};

const ProgressBar: React.FC = () => {
  const progress = useProgress();

  return (
    <RadialProgressBar className="w-28 h-28" progress={progress}>
      <h3>{Math.round(progress)}%</h3>
    </RadialProgressBar>
  );
};

import { useTask } from '../hooks/useTask';
import { Card } from '../lib/Card';

type TTaskItemProps = {
  id: string;
};

export const TaskItem: React.FC<TTaskItemProps> = ({ id }) => {
  const { data } = useTask(id);

  return (
    <Card className="w-full px-6 py-4">
      <article className="capitalize">{data.label}</article>
    </Card>
  );
};

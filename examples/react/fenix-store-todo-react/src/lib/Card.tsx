import { PropsWithChildren } from 'react';
import { classNames } from '../utils/classNames';

type TCardProps = PropsWithChildren & {
  className?: string;
};

export const Card: React.FC<TCardProps> = ({ children, className }) => {
  return (
    <section
      className={classNames(
        'bg-gray-500 bg-opacity-10 dark:bg-opacity-5',
        'border border-gray-300 dark:border-gray-700',
        'rounded-xl',
        className,
      )}
    >
      {children}
    </section>
  );
};

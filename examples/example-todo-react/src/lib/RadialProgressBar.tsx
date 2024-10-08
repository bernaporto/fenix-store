// ref: https://gist.github.com/eYinka/873be69fae3ef27b103681b8a9f5e379
import { PropsWithChildren } from 'react';
import { classNames } from '../utils/classNames';

type TRadialProgressBarProps = PropsWithChildren & {
  progress: number;
  className?: string;
};

export const RadialProgressBar: React.FC<TRadialProgressBarProps> = ({
  children,
  className,
  progress,
}) => {
  return (
    <section
      className={classNames(
        'relative flex items-center justify-center',
        className,
      )}
    >
      <svg className="absolute w-full h-full" viewBox="0 0 100 100">
        {/*  Background circle */}
        <circle
          className="text-gray-200 dark:text-gray-800 stroke-current"
          cx="50"
          cy="50"
          fill="transparent"
          r="40"
          strokeWidth="10"
        ></circle>
        {/* Progress circle */}
        <circle
          className="text-primary-400 dark:text-primary-500 stroke-current"
          cx="50"
          cy="50"
          fill="transparent"
          r="40"
          style={{
            transition: 'stroke-dashoffset 0.2s',
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
          }}
          strokeDasharray="251.2"
          strokeDashoffset={`calc(251.2px - (251.2px * ${progress}) / 100)`}
          strokeLinecap="round"
          strokeWidth="10"
        ></circle>
      </svg>

      {children}
    </section>
  );
};

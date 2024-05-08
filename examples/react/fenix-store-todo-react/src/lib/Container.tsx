import { PropsWithChildren } from 'react';

export const Container: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="max-w-lg h-full m-auto p-8 flex flex-col gap-8">
      {children}
    </div>
  );
};

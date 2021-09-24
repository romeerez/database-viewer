import React, { ReactNode } from 'react';
import { useTablePageContext } from '../TablePage.context';

export default function InputWrap({
  hidden,
  children,
}: {
  hidden: boolean;
  children: ReactNode;
}) {
  const { floatingInputService: service } = useTablePageContext();
  const cell = service.use('cell');

  return (
    <div
      className="absolute flex flex-col items-start z-10"
      hidden={hidden}
      style={{
        top: cell && `${cell.offsetTop}px`,
        left: cell && `${cell.offsetLeft}px`,
      }}
    >
      {children}
    </div>
  );
}

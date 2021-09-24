import React, { ReactNode, forwardRef } from 'react';
import { useTablePageContext } from '../TablePage.context';
import cn from 'classnames';

export default forwardRef<
  HTMLDivElement,
  {
    hidden: boolean;
    children: ReactNode;
    className?: string;
  }
>(function InputWrap({ hidden, children, className }, ref) {
  const { floatingInputService: service } = useTablePageContext();
  const cell = service.use('cell');

  return (
    <div
      ref={ref}
      className={cn('absolute flex flex-col items-start z-10', className)}
      hidden={hidden}
      style={{
        top: cell && `${cell.offsetTop}px`,
        left: cell && `${cell.offsetLeft}px`,
      }}
    >
      {children}
    </div>
  );
});

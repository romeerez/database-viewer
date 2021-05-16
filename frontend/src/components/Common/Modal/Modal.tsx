import React from 'react';
import Appear from 'components/Common/Appear/Appear';
import Scrollbars from 'components/Common/Scrollbars';
import cn from 'classnames';
import style from './style.module.css';

export default function Modal({
  open,
  onClose,
  children,
  className,
  ...props
}: {
  open: boolean;
  onClose: () => void;
  children: (onClose: () => void) => React.ReactNode;
  className?: string;
}) {
  const [isOpen, setOpen] = React.useState(open);
  const close = () => setOpen(false);

  React.useEffect(() => {
    setOpen(open);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className={cn(
        'fixed top-0 left-0 right-0 bottom-0 z-50 flex-center duration-200 transition-all',
        isOpen ? style.open : style.closed,
      )}
      onClick={close}
      {...props}
    >
      <Scrollbars>
        <div
          className={cn(
            'max-h-full h-full w-full py-10 flex-center',
            className,
          )}
        >
          <Appear
            open={isOpen}
            onClose={onClose}
            className={cn(
              'bg-primary-gradient rounded-lg shadow max-w-full m-auto',
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {children(close)}
          </Appear>
        </div>
      </Scrollbars>
    </div>
  );
}

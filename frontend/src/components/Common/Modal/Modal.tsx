import React from 'react';
import Appear from '../../../components/Common/Appear/Appear';
import Scrollbars from '../../../components/Common/Scrollbars';
import cn from 'classnames';
import style from './style.module.css';
import { X } from '../../../icons';
import { useKey } from 'react-use';

export default function Modal({
  open,
  onClose,
  children,
  className,
  closeButton,
  closeOnEscape,
}: {
  open: boolean;
  onClose: () => void;
  children: (onClose: () => void) => React.ReactNode;
  className?: string;
  closeButton?: boolean;
  closeOnEscape?: boolean;
}) {
  const [isOpen, setOpen] = React.useState(open);
  const close = () => setOpen(false);

  React.useEffect(() => {
    setOpen(open);
  }, [open]);

  useKey('Escape', () => {
    if (closeOnEscape) close();
  });

  if (!open) return null;

  return (
    <div
      className={cn(
        'fixed top-0 left-0 right-0 bottom-0 z-50 flex-center duration-200 transition-all',
        isOpen ? style.open : style.closed,
      )}
      onClick={close}
    >
      <Scrollbars>
        <div className={'max-h-full h-full w-full py-10 flex-center'}>
          <Appear
            open={isOpen}
            onClose={onClose}
            className={cn(
              'bg-primary-gradient rounded-lg shadow flex-grow m-auto',
              className,
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {closeButton && (
              <button
                type="button"
                className="flex absolute top-4 right-4 z-50"
                onClick={onClose}
              >
                <X size={24} />
              </button>
            )}
            {children(close)}
          </Appear>
        </div>
      </Scrollbars>
    </div>
  );
}

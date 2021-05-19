import React, { useRef, useState } from 'react';
import cn from 'clsx';
import Appear from 'components/Common/Appear/Appear';
import { useClickAway } from 'react-use';
import { createPortal } from 'react-dom';

type Toggle = (e?: React.SyntheticEvent | boolean) => void;

export default function Menu({
  open,
  setOpen,
  className,
  menuClass,
  menuStyle,
  button,
  children,
}: {
  open?: boolean;
  setOpen?(value: boolean): void;
  className?: string;
  menuClass?: string;
  menuStyle?: React.CSSProperties;
  button: (toggle: Toggle) => React.ReactNode;
  children: (toggle: Toggle) => React.ReactNode;
}) {
  const [ownIsOpen, ownSetOpen] = useState(false);

  const isOpen = open ?? ownIsOpen;
  const changeOpen = setOpen ?? ownSetOpen;

  const toggle = (e?: React.SyntheticEvent | boolean) => {
    if (e === true || e === false) {
      changeOpen(e);
    } else {
      changeOpen(!isOpen);
    }
  };

  const close = () => changeOpen(false);

  const ref = useRef<HTMLDivElement | null>(null);
  useClickAway(ref, close);

  return (
    <div ref={ref} className={cn('relative', className)}>
      {button(toggle)}
      <Appear
        open={isOpen}
        onClose={close}
        className={cn(
          'absolute z-50 text-md top-full bg-primary-gradient-lighter min-w-full rounded py-1 shadow',
          menuClass,
        )}
        style={menuStyle}
      >
        {children(toggle)}
      </Appear>
    </div>
  );
}

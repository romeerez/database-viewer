import React, { ReactNode, useRef, useState } from 'react';
import cn from 'classnames';
import Appear from '../../../components/Common/Appear/Appear';
import { useClickAway } from 'react-use';
import Tooltip from '../../../components/Common/Tooltip/Tooltip';

type Toggle = (e?: React.SyntheticEvent | boolean) => void;

export default function Menu({
  open,
  setOpen,
  className,
  menuClass,
  menuStyle,
  button,
  tooltip,
  children,
}: {
  open?: boolean;
  setOpen?(value: boolean): void;
  className?: string;
  menuClass?: string;
  menuStyle?: React.CSSProperties;
  button: (toggle: Toggle) => React.ReactNode;
  tooltip?: ReactNode;
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

  const menu = (
    <div ref={ref} className={cn('relative', className)}>
      {button(toggle)}
      <Appear
        open={isOpen}
        onClose={close}
        className={cn(
          'absolute z-40 text-md top-full bg-primary-gradient-lighter min-w-full rounded py-1 shadow',
          menuClass,
        )}
        style={menuStyle}
      >
        {children(toggle)}
      </Appear>
    </div>
  );

  return tooltip ? (
    <Tooltip text={tooltip} open={isOpen ? false : undefined}>
      {menu}
    </Tooltip>
  ) : (
    menu
  );
}

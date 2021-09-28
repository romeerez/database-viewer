import React, { ReactNode, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import Appear from '../../../components/Common/Appear/Appear';
import Tooltip from '../../../components/Common/Tooltip/Tooltip';
import OverlayItem from '../OverlayContent/OverlayItem';

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

  useEffect(() => {
    const el = ref.current as HTMLDivElement;
    let elClicked = false;

    const globalClick = () => {
      if (elClicked) {
        elClicked = false;
      } else {
        close();
      }
    };

    const elClick = () => {
      elClicked = true;
    };

    document.body.addEventListener('click', globalClick);
    el.addEventListener('click', elClick);
    return () => {
      document.body.removeEventListener('click', globalClick);
      el.removeEventListener('click', elClick);
    };
  }, []);

  const menu = (
    <div ref={ref} className={cn('relative', className)}>
      {button(toggle)}
      <OverlayItem targetRef={ref} open={isOpen} onClose={close}>
        <div
          className={cn(
            'absolute transform -translate-x-1/2 text-md bg-primary-gradient-lighter rounded py-1 shadow',
            menuClass,
          )}
          style={menuStyle}
        >
          {children(toggle)}
        </div>
      </OverlayItem>
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

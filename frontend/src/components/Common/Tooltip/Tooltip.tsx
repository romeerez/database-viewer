import React, { ReactNode } from 'react';
import cn from 'classnames';
import { usePopperTooltip } from 'react-popper-tooltip';
import style from './Tooltip.module.css';

export default function Tooltip({
  text,
  hotkey,
  open,
  children,
}: {
  text: ReactNode;
  hotkey?: string;
  open?: boolean;
  children: ReactNode;
}) {
  const {
    getArrowProps,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible,
  } = usePopperTooltip();

  return (
    <div ref={setTriggerRef}>
      {children}
      {(open === undefined ? visible : open) && (
        <div
          ref={setTooltipRef}
          {...getTooltipProps()}
          className="bg-dark-6 px-2 py-1 rounded z-50"
        >
          {text}
          {hotkey && ' '}
          {hotkey && <span className="text-accent">[{hotkey}]</span>}
          <div
            {...getArrowProps()}
            className={cn('text-dark-6', style.arrowUp)}
          />
        </div>
      )}
    </div>
  );
}

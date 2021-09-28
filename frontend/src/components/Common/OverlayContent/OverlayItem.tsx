import React, { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useOverlayItemElement } from './OverlayContent';
import cn from 'classnames';
import style from '../Appear/style.module.css';

export default function OverlayItem({
  targetRef,
  open,
  onClose,
  className,
  children,
}: {
  targetRef: { current: HTMLElement | null };
  open: boolean;
  onClose(): void;
  className?: string;
  children: ReactNode;
}) {
  const [el, setOpen] = useOverlayItemElement();

  const [ref] = React.useState<{ current: HTMLDivElement | null }>({
    current: null,
  });

  useEffect(() => {
    const el = ref.current;

    if (open) {
      setOpen(true);

      const target = targetRef.current;
      if (!target || !el) return;

      const rect = target.getBoundingClientRect();
      el.style.top = `${rect.top + rect.height}px`;
      el.style.left = `${rect.left + rect.width / 2}px`;

      el.getBoundingClientRect();
      el.classList.add(style.appearTo);
    } else if (el?.classList.contains(style.appearTo)) {
      setOpen(false);

      el.classList.remove(style.appearTo);

      el.addEventListener('transitionend', onClose, { once: true });
    }
  }, [open]);

  return createPortal(
    <div
      ref={ref}
      className={cn(
        'fixed z-50',
        style.transition,
        style.appearFrom,
        className,
      )}
    >
      {children}
    </div>,
    el,
  );
}

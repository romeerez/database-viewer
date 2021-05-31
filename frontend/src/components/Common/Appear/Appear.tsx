import React from 'react';
import cn from 'classnames';
import style from './style.module.css';

export default function Appear({
  open,
  onClose,
  children,
  className,
  animate = true,
  animateClose = true,
  ...props
}: {
  open: boolean;
  onClose(): void;
  children: React.ReactNode;
  animate?: boolean;
  animateClose?: boolean;
} & React.HTMLAttributes<HTMLDivElement>) {
  const [isOpen, setOpen] = React.useState(open);

  const [ref] = React.useState<{ current: HTMLDivElement | null }>({
    current: null,
  });

  React.useEffect(() => {
    const el = ref.current;
    if (open) {
      setOpen(true);
    } else if (animateClose && el) {
      el.classList.remove(style.appearTo);

      el.addEventListener(
        'transitionend',
        () => {
          setOpen(false);
          onClose();
        },
        { once: true },
      );
    } else {
      setOpen(false);
    }
  }, [open]);

  if (!isOpen) return null;

  if (!animate) {
    return (
      <div className={className} {...props}>
        {children}
      </div>
    );
  }

  const setRef = (el: HTMLDivElement | null) => {
    const { current } = ref;
    ref.current = el;

    if (!current && el && open) {
      el.getBoundingClientRect();
      el.classList.add(style.appearTo);
    }
  };

  return (
    <div
      ref={setRef}
      className={cn(style.transition, style.appearFrom, className)}
      {...props}
    >
      {children}
    </div>
  );
}

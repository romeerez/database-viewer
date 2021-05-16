import React from 'react';
import cn from 'clsx';
import style from './style.module.css';

export default function Appear({
  open,
  onClose,
  children,
  className,
  slide = false,
  ...props
}: {
  open: boolean;
  onClose(): void;
  slide?: boolean;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  const [isOpen, setOpen] = React.useState(open);

  slide = false;

  const [ref] = React.useState<{ current: HTMLDivElement | null }>({
    current: null,
  });

  const setRef = (el: HTMLDivElement | null) => {
    const { current } = ref;
    ref.current = el;

    if (!current && el && open) {
      if (slide) {
        el.style.zIndex = '-1';
        el.classList.remove(style.transition);
        el.classList.add(style.appearTo);
        const height = el.getBoundingClientRect().height;
        el.style.marginTop = `-${height}px`;
        el.classList.remove(style.appearTo);

        el.addEventListener('transitionend', () => (el.style.zIndex = '0'), {
          once: true,
        });
      }

      el.getBoundingClientRect();

      if (slide) {
        el.classList.add(style.transition);
        el.style.marginTop = '0';
        Object.assign(el.style);
      }

      el.classList.add(style.appearTo);
    }
  };

  React.useEffect(() => {
    const el = ref.current;
    if (open) {
      setOpen(true);
    } else if (el) {
      el.classList.remove(style.appearTo);

      if (slide) {
        const height = el.offsetHeight;
        el.style.marginTop = `-${height}px`;
        el.style.zIndex = '-1';
      }

      el.addEventListener(
        'transitionend',
        () => {
          setOpen(false);
          onClose();
        },
        { once: true },
      );
    }
  }, [open]);

  if (!isOpen) return null;

  return (
    <div
      ref={setRef}
      className={cn(
        style.transition,
        style.appearFrom,
        className,
        slide && 'relative',
      )}
      style={slide ? { zIndex: -1 } : undefined}
      {...props}
    >
      {children}
    </div>
  );
}

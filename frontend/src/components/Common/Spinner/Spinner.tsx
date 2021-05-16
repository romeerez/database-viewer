import React from 'react';
import style from './style.module.css';
import cn from 'classnames';

export default React.memo(function Spinner({
  show = true,
  className = 'w-8 duration-300 transition-all',
  addClass,
  size = 'w-2',
}: {
  show?: boolean;
  className?: string;
  addClass?: string;
  size?: string;
}) {
  const [isShown, setShown] = React.useState(show);

  const ref = (el: HTMLDivElement | null) => {
    if (el) {
      el.addEventListener(
        'transitionend',
        () => {
          if (!show) setShown(false);
        },
        { once: true },
      );
    }
  };

  React.useEffect(() => {
    if (show) setShown(true);
  }, [show]);

  if (!isShown) return null;

  return (
    <div
      className={cn(style.spinner, className, addClass, show && style.show)}
      ref={ref}
    >
      <div className={cn(style.bounce1, size)} />
      <div className={cn(style.bounce2, size)} />
      <div className={cn(style.bounce3, size)} />
    </div>
  );
});

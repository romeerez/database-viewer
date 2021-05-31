import React, { RefObject } from 'react';
import { positionValues, Scrollbars as Scroll } from 'react-custom-scrollbars';
import cn from 'classnames';

const shadow =
  'border-darker from-darker-5 to-transparent absolute z-40 pointer-events-none';

export default function Scrollbars({
  onUpdate,
  shadows = true,
  children,
  scrollRef,
}: {
  onUpdate?: (values: positionValues) => void;
  shadows?: boolean;
  children: React.ReactNode;
  scrollRef?: RefObject<Scroll>;
}) {
  const shadowRightRef = React.useRef<HTMLDivElement>(null);
  const shadowBottomRef = React.useRef<HTMLDivElement>(null);
  const shadowLeftRef = React.useRef<HTMLDivElement>(null);
  const prevScrollRef = React.useRef({ bottom: 0, left: 0, right: 0 });

  const handleUpdate = (values: positionValues) => {
    if (onUpdate) onUpdate(values);

    if (!shadows) return;

    const prevScroll = prevScrollRef.current;
    if (!prevScroll) return;

    const {
      scrollTop,
      scrollLeft,
      scrollHeight,
      scrollWidth,
      clientHeight,
      clientWidth,
    } = values;

    const scrollBottom = scrollHeight - clientHeight - scrollTop;
    if (
      shadowBottomRef.current &&
      Math.min(prevScroll.bottom, scrollBottom) < 20
    ) {
      shadowBottomRef.current.style.opacity = String(
        Math.min(20, scrollBottom) / 20,
      );
    }

    const scrollRight = scrollWidth - clientWidth - scrollLeft;
    if (
      shadowRightRef.current &&
      Math.min(prevScroll.right, scrollRight) < 20
    ) {
      shadowRightRef.current.style.opacity = String(
        Math.min(20, scrollRight) / 20,
      );
    }

    if (shadowLeftRef.current && Math.min(prevScroll.left, scrollLeft) < 20) {
      shadowLeftRef.current.style.opacity = String(
        Math.min(20, scrollLeft) / 20,
      );
    }

    prevScroll.bottom = scrollBottom;
    prevScroll.left = scrollLeft;
    prevScroll.right = scrollRight;
  };

  return (
    <div className="relative h-full w-full">
      <Scroll
        ref={scrollRef}
        onUpdate={handleUpdate}
        renderThumbVertical={({ style, ...props }) => (
          <div {...props} style={style} className="bg-dark-5 z-40" />
        )}
        renderThumbHorizontal={({ style, ...props }) => (
          <div {...props} style={style} className="bg-dark-5 z-40" />
        )}
      >
        {children}
      </Scroll>
      {shadows && (
        <>
          <div
            ref={shadowBottomRef}
            className={cn(
              shadow,
              'bg-gradient-to-t bottom-0 left-0 right-0 h-8 border-b-2',
            )}
          />
          <div
            ref={shadowRightRef}
            className={cn(
              shadow,
              'bg-gradient-to-l right-0 top-0 bottom-0 w-8 border-r-2',
            )}
          />
          <div
            ref={shadowLeftRef}
            className={cn(
              shadow,
              'bg-gradient-to-r left-0 top-0 bottom-0 w-8 border-l-2',
            )}
          />
        </>
      )}
    </div>
  );
}

import React, { useCallback, useLayoutEffect, useMemo, useRef } from 'react';

const overlayWrapElement = document.createElement('div');
const overlayBackgroundRef: { current: HTMLDivElement | null } = {
  current: null,
};

let activeItems = 0;

export const useOverlayItemElement = () => {
  const el = useMemo(() => document.createElement('div'), []);

  useLayoutEffect(() => {
    overlayWrapElement.appendChild(el);
    return () => {
      overlayWrapElement.removeChild(el);
    };
  }, [overlayWrapElement]);

  const setOpen = useCallback((open: boolean) => {
    activeItems += open ? 1 : -1;
    const bg = overlayBackgroundRef.current;
    if (bg) bg.hidden = activeItems === 0;
  }, []);

  return [el, setOpen] as const;
};

export default function OverlayContent() {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    (ref.current as HTMLDivElement).appendChild(overlayWrapElement);
  }, []);

  return (
    <div ref={ref}>
      <div ref={overlayBackgroundRef} hidden className="fixed inset-0" />
    </div>
  );
}

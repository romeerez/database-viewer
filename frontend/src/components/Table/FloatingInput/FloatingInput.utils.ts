import React, { useLayoutEffect } from 'react';

const tdPaddingXPx = '16px';

export const useResizeInput = ({
  inputRef,
  hidden,
  value,
  placeholder,
  vertical = false,
  wrapRef,
  minWidth = 0,
}: {
  inputRef: React.RefObject<HTMLElement>;
  hidden: boolean;
  value: string | null;
  placeholder?: string;
  vertical?: boolean;
  wrapRef?: React.RefObject<HTMLDivElement>;
  minWidth?: number;
}) => {
  useLayoutEffect(() => {
    if (hidden) return;

    const el = inputRef.current;
    if (!el) return;

    el.style.width = '0';
    if (vertical) {
      el.style.height = '0';
    }
    el.style.paddingLeft = el.style.paddingRight = tdPaddingXPx;
    el.style.width = `${Math.max(
      el.scrollWidth,
      wrapRef?.current?.offsetWidth || 0,
      minWidth,
    )}px`;
    if (vertical) {
      el.style.height = `${el.scrollHeight}px`;
    }
    el.style.paddingLeft = el.style.paddingRight = '';
  }, [inputRef, hidden, value, placeholder, vertical, wrapRef]);
};

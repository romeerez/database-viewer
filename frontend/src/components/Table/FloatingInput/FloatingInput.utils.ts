import React, { useLayoutEffect } from 'react';

const tdPaddingXPx = '16px';

export const useResizeInput = (
  ref: React.RefObject<HTMLElement>,
  hidden: boolean,
  value: string | null,
  placeholder?: string,
  vertical = false,
) => {
  useLayoutEffect(() => {
    if (hidden) return;

    const el = ref.current;
    if (!el) return;

    el.style.width = '0';
    if (vertical) {
      el.style.height = '0';
    }
    el.style.paddingLeft = el.style.paddingRight = tdPaddingXPx;
    el.style.width = `${el.scrollWidth}px`;
    if (vertical) {
      el.style.height = `${el.scrollHeight}px`;
    }
    el.style.paddingLeft = el.style.paddingRight = '';
  }, [ref, hidden, value, placeholder, vertical]);
};

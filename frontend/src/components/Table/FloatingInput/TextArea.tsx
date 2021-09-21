import React, { useEffect, useLayoutEffect } from 'react';
import { useTablePageContext } from '../TablePage.context';

const tdPaddingXPx = '32px';

export default function TextArea() {
  const { floatingInputService } = useTablePageContext();
  const { textAreaRef } = floatingInputService;

  const value = floatingInputService.use((state) => state.value);
  const cell = floatingInputService.use((state) => state.cell);
  const placeholder = floatingInputService.usePlaceholder();

  useEffect(() => {}, [cell]);

  useLayoutEffect(() => {
    const el = textAreaRef.current;
    if (!el) return;

    el.style.width = '0';
    el.style.height = '0';
    el.style.paddingLeft = tdPaddingXPx;
    el.style.width = `${el.scrollWidth}px`;
    el.style.height = `${el.scrollHeight}px`;
    el.style.paddingLeft = '';
  }, [value, placeholder]);

  const onChange = (e: { target: HTMLTextAreaElement }) => {
    floatingInputService.setValue(e.target.value);
  };

  return (
    <textarea
      ref={textAreaRef}
      autoFocus
      className="ring rounded-sm px-4 py-2.5 text-sm whitespace-nowrap overflow-hidden w-0 h-0 placeholder-light-9 block resize-none"
      onChange={onChange}
      placeholder={placeholder}
      value={value || ''}
    />
  );
}

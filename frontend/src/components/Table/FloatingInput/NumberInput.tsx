import React, { useLayoutEffect } from 'react';
import { useTablePageContext } from '../TablePage.context';

const tdPaddingXPx = '32px';

export default function NumberInput() {
  const { floatingInputService } = useTablePageContext();
  const { numberInputRef } = floatingInputService;

  const value = floatingInputService.use('value');
  const placeholder = floatingInputService.usePlaceholder();
  const isInteger = floatingInputService.use('isInteger');

  useLayoutEffect(() => {
    const el = numberInputRef.current;
    if (!el) return;

    el.style.width = '0';
    el.style.height = '0';
    el.style.paddingLeft = tdPaddingXPx;
    el.style.width = `${el.scrollWidth}px`;
    el.style.height = `${el.scrollHeight}px`;
    el.style.paddingLeft = '';
  }, [value, placeholder]);

  const onChange = (e: { target: { value: string } }) => {
    const number = (isInteger ? parseInt : parseFloat)(e.target.value);
    const value = isNaN(number) ? '' : String(number);
    floatingInputService.setValue(value);
  };

  return (
    <input
      ref={numberInputRef}
      autoFocus
      className="ring rounded-sm px-4 py-2.5 text-sm whitespace-nowrap overflow-hidden w-0 h-0 placeholder-light-9 block resize-none text-right"
      onChange={onChange}
      placeholder={placeholder}
      value={value || ''}
    />
  );
}

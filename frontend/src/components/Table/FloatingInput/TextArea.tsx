import React, { useLayoutEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { useTablePageContext } from '../../../components/Table/TablePage.context';

const tdPaddingXPx = '32px';

export default observer(function TextArea() {
  const { floatingInputService } = useTablePageContext();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const value = floatingInputService.getValue();
  const placeholder = floatingInputService.getPlaceholder();
  const cell = floatingInputService.getCell();

  useLayoutEffect(() => {
    const el = textAreaRef.current;
    if (!el || !cell) return;

    el.style.minWidth = `${cell.minWidth}px`;
    el.style.minHeight = `${cell.minHeight}px`;
    el.classList.remove((el.dataset as { bgClass: string }).bgClass);

    el.classList.add(cell.className);
    (el.dataset as { bgClass: string }).bgClass = cell.className;

    el.focus();
  }, [cell]);

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

  const onBlur = floatingInputService.initBlur;

  return (
    <textarea
      ref={textAreaRef}
      className="ring rounded-sm px-4 py-2.5 text-sm whitespace-nowrap overflow-hidden w-0 h-0 placeholder-light-9 block resize-none"
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      value={value || ''}
    />
  );
});

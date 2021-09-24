import React, { useEffect } from 'react';
import { useTablePageContext } from '../TablePage.context';
import TextArea from './Inputs/TextArea';
import NumberInput from './Inputs/NumberInput';
import DateTimeInput from './Inputs/DateTimeInput';

export default function FloatingInput() {
  const { floatingInputService: service } = useTablePageContext();

  const cell = service.use((state) => state.cell);

  const onMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!cell) {
      return;
    }
    if (e.key === 'Escape') {
      service.cancel();
    } else if (e.key == 'Enter' && !e.ctrlKey && !e.shiftKey) {
      service.submit();
    }
  };

  useEffect(() => {
    if (!cell) return;

    const listener = () => service.submitOrCancel();
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [cell, service]);

  const isSingleCell = service.isSingleCell();

  return (
    <div onMouseDown={onMouseDown} onKeyDown={onKeyDown}>
      <div hidden={isSingleCell} tabIndex={0} onFocus={service.focusPrev} />
      <NumberInput />
      <DateTimeInput />
      <TextArea />
      <div hidden={isSingleCell} tabIndex={0} onFocus={service.focusNext} />
    </div>
  );
}

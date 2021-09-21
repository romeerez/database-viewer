import React, { ReactNode, useEffect } from 'react';
import { useTablePageContext } from '../TablePage.context';
import ToggleEmpty from './ToggleRaw';
import TextArea from './TextArea';

export default function FloatingInput({ children }: { children: ReactNode }) {
  const { floatingInputService, tableService } = useTablePageContext();

  const onWrapMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const cell = floatingInputService.use((state) => state.cell);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!cell) {
      return;
    }
    if (e.key === 'Escape') {
      floatingInputService.setCell();
      const td = tableService.getCell(cell.row, cell.column);
      td?.focus();
    }
  };

  useEffect(() => {
    if (!cell) return;

    const listener = () => floatingInputService.setCell();
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [cell]);

  const isSingleCell = floatingInputService.isSingleCell();

  return (
    <>
      {children}
      <div onMouseDownCapture={onWrapMouseDown} onKeyDown={onKeyDown}>
        <div
          hidden={isSingleCell}
          tabIndex={0}
          onFocus={floatingInputService.focusPrev}
        />
        <div
          className="absolute flex flex-col items-start z-10"
          hidden={!cell}
          style={{
            top: cell && `${cell.offsetTop}px`,
            left: cell && `${cell.offsetLeft}px`,
          }}
        >
          <TextArea />
          <ToggleEmpty />
        </div>
        <div
          hidden={isSingleCell}
          tabIndex={0}
          onFocus={floatingInputService.focusNext}
        />
      </div>
    </>
  );
}

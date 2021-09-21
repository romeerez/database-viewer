import React, { ReactNode, useEffect, useRef } from 'react';
import { useTablePageContext } from '../TablePage.context';
import { CellType } from '../Table/Table.service';

export default function Selection({ children }: { children: ReactNode }) {
  const { tableService, selectionService, floatingInputService } =
    useTablePageContext();
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const onMouseDown = (e: MouseEvent) => {
      selectionService.startSelection({
        cell: tableService.getCellData(e.target as HTMLElement),
        addToSelection: e.ctrlKey,
        continueSelection: e.shiftKey,
      });
    };

    const onMouseMove = (e: MouseEvent) => {
      selectionService.moveSelection({
        cell: tableService.getCellData(e.target as HTMLElement),
        continueSelection: e.shiftKey,
      });
    };

    const onMouseUp = (e: MouseEvent) => {
      selectionService.endSelection({
        cell: tableService.getCellData(e.target as HTMLElement),
      });
    };

    const keyToDirection = {
      ArrowUp: 'up',
      ArrowRight: 'right',
      ArrowDown: 'down',
      ArrowLeft: 'left',
    } as const;

    const onKeyDown = (e: KeyboardEvent) => {
      const cell = tableService.getCellData(e.target as HTMLElement);
      if (!cell) return;

      const direction = keyToDirection[e.key as keyof typeof keyToDirection];
      if (direction) {
        selectionService.moveSelectionToDirection(direction, e.shiftKey);
      } else if (
        e.key.length === 1 ||
        e.key === 'Backspace' ||
        e.key === 'Delete'
      ) {
        floatingInputService.focus();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        floatingInputService.focus();
      }
    };

    const onFocus = (e: FocusEvent) => {
      if (selectionService.state.selecting) {
        return;
      }
      const cell = tableService.getCellData(e.target as HTMLElement);
      if (cell?.type === CellType.cell) {
        selectionService.selectAndFocusCell(cell.row, cell.column);
      }
    };

    wrap.addEventListener('mousedown', onMouseDown);
    wrap.addEventListener('mousemove', onMouseMove);
    wrap.addEventListener('mouseup', onMouseUp);
    document.addEventListener('focus', onFocus, true);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      wrap.removeEventListener('mousedown', onMouseDown);
      wrap.removeEventListener('mousemove', onMouseMove);
      wrap.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('focus', onFocus, true);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [floatingInputService, selectionService, tableService]);

  return <div ref={wrapRef}>{children}</div>;
}

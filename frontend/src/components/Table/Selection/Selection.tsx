import React, { ReactNode, useEffect, useRef } from 'react';
import { Cell, CellType } from './selection.store';
import { useTablePageContext } from 'components/Table/TablePage.context';

export default function Selection({ children }: { children: ReactNode }) {
  const { selectionService } = useTablePageContext();
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const getCellDataFromElement = (
      el: EventTarget | null,
    ): Cell | undefined => {
      if (!el) return;

      const {
        selectionType: type,
        selectionRow: rowIndex,
        selectionColumn: columnIndex,
      } = (el as HTMLElement).dataset;

      if (type === CellType.row) {
        return {
          type: CellType.row,
          rowIndex: parseInt(rowIndex as string),
        };
      } else if (type === CellType.column) {
        return {
          type: CellType.column,
          columnIndex: parseInt(columnIndex as string),
        };
      } else if (type === CellType.cell) {
        return {
          type: CellType.cell,
          rowIndex: parseInt(rowIndex as string),
          columnIndex: parseInt(columnIndex as string),
        };
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      selectionService.startSelection({
        cell: getCellDataFromElement(e.target),
        addToSelection: e.ctrlKey,
        continueSelection: e.shiftKey,
        focus: () => (e.target as HTMLElement).focus(),
      });
    };

    const onMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      selectionService.moveSelection({
        cell: getCellDataFromElement(e.target),
        continueSelection: e.shiftKey,
      });
    };

    const onMouseUp = (e: MouseEvent) => {
      e.preventDefault();
      selectionService.endSelection({
        cell: getCellDataFromElement(e.target),
      });
    };

    wrap.addEventListener('mousedown', onMouseDown);
    wrap.addEventListener('mousemove', onMouseMove);
    wrap.addEventListener('mouseup', onMouseUp);

    return () => {
      wrap.removeEventListener('mousedown', onMouseDown);
      wrap.removeEventListener('mousemove', onMouseMove);
      wrap.removeEventListener('mouseup', onMouseUp);
    };
  }, [wrapRef]);

  return <div ref={wrapRef}>{children}</div>;
}

import { useEffect, useMemo } from 'react';
import { useFloatingInputStore } from './FloatingInput.store';
import { TableDataService } from '../TableData/tableData.service';
import { SelectionService } from '../Selection/selection.service';
import { DataChangesService } from '../DataChanges/dataChanges.service';
import { TableService } from '../Table/Table.service';

export type FloatingInputService = ReturnType<typeof useFloatingInputService>;

export const useFloatingInputService = ({
  tableService,
  tableDataService,
  dataChangesService,
  selectionService,
}: {
  tableService: TableService;
  tableDataService: TableDataService;
  dataChangesService: DataChangesService;
  selectionService: SelectionService;
}) => {
  const store = useFloatingInputStore({ tableDataService });

  const service = useMemo(
    () => ({
      ...store,
      hide: () => service.setCell(),
      isSingleCell: () => {
        const columnsCount = tableDataService.state.fields?.length;
        const rowsCount = tableDataService.state.rows?.length;
        return (
          !columnsCount || !rowsCount || (columnsCount === 1 && rowsCount === 1)
        );
      },
      focus() {
        const { focusedDataCell } = selectionService.state;
        if (!focusedDataCell) return;

        const { row, column } = focusedDataCell;

        service.setCell({ row, column });
      },
      setCell(object?: { row: number; column: number }) {
        if (!object) {
          store.setCell();
          return;
        }

        const td = tableService.getCell(object.row, object.column);
        const type = tableDataService.state.fields?.[object.column]?.type;
        if (!td || !type) {
          store.setCell();
          return;
        }

        const cell = {
          row: object.row,
          column: object.column,
          offsetTop: td.offsetTop,
          offsetLeft: td.offsetLeft,
          minWidth: td.offsetWidth,
          minHeight: td.offsetHeight,
          className: (td.dataset as { bgClass: string }).bgClass,
          type,
        };

        store.setCell(cell);
        store.setValue(dataChangesService.getValue(cell.row, cell.column));

        const el = store.state.inputRef.current;
        if (!el || !cell) return;

        el.style.minWidth = `${cell.minWidth}px`;
        el.style.minHeight = `${cell.minHeight}px`;
        el.classList.remove((el.dataset as { bgClass: string }).bgClass);

        el.classList.add(cell.className);
        (el.dataset as { bgClass: string }).bgClass = cell.className;

        el.focus();
      },
      usePlaceholder() {
        return store.use(({ cell, defaults, fields, value, isRaw }) => {
          if (!cell) return;

          const defaultValue = defaults && defaults[cell.column];
          const field = fields && fields[cell.column];

          return value === null || isRaw
            ? defaultValue || (!field?.isNullable ? 'required' : 'null')
            : 'empty';
        });
      },
      setValue(value: string) {
        store.setValue(value);
        selectionService.setValue(value, store.state.isRaw);
      },
      setIsRaw(isRaw: boolean) {
        store.setIsRaw(isRaw);
        selectionService.setValue(store.state.value, isRaw);
      },
      focusPrev() {
        service.focusOther('prev');
      },
      focusNext() {
        service.focusOther('next');
      },
      focusOther(type: 'prev' | 'next') {
        const { cell } = store.state;
        const columnsCount = tableDataService.state.fields?.length;
        const rowsCount = tableDataService.state.rows?.length;

        if (!cell || !columnsCount || !rowsCount) return;
        let { row, column } = cell;

        column += type === 'prev' ? -1 : 1;
        if (column < 0 || column >= columnsCount) {
          column = type === 'prev' ? columnsCount - 1 : 0;
          row += type === 'prev' ? -1 : 1;
          if (row < 0 || row >= rowsCount) {
            row = type === 'prev' ? rowsCount - 1 : 0;
          }
        }

        selectionService.selectAndFocusCell(row, column);
        service.focus();
      },
    }),
    [
      store,
      tableService,
      tableDataService,
      dataChangesService,
      selectionService,
    ],
  );

  const { rows } = tableDataService.state;
  useEffect(() => service.hide(), [service, rows]);

  return service;
};

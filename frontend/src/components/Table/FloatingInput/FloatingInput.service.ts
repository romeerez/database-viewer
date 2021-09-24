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
      submit() {
        if (store.getIsValid()) {
          service.hide();
        }
      },
      cancel() {
        const { cell, initialValue, initialIsRaw } = store.state;
        if (!cell) return;

        dataChangesService.setValue(
          cell.row,
          cell.column,
          initialValue,
          initialIsRaw,
        );

        service.hide();
      },
      submitOrCancel() {
        if (store.getIsValid()) {
          service.submit();
        } else {
          service.cancel();
        }
      },
      hide() {
        const { cell } = store.state;
        if (!cell) return;

        service.setCell();
        const td = tableService.getCell(String(cell.row), String(cell.column));
        td?.focus();
      },
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
          store.set({ cell: undefined, type: '' });
          return;
        }

        const td = tableService.getCell(
          String(object.row),
          String(object.column),
        );
        const type = tableDataService.state.fields?.[object.column]?.type;
        if (!td || !type) {
          store.set({ cell: undefined, type: '' });
          return;
        }

        const cell = {
          row: object.row,
          column: object.column,
          offsetTop: td.offsetTop,
          offsetLeft: td.offsetLeft,
          minWidth: td.offsetWidth,
          minHeight: td.offsetHeight,
          type,
        };

        const value = dataChangesService.getValue(cell.row, cell.column);
        const isRaw = dataChangesService.getIsRaw(cell.row, cell.column);

        store.init(cell, type, value, isRaw);

        const el = store.state.inputStore.inputRef.current;
        if (!el || !cell) return;

        el.style.minWidth = `${cell.minWidth}px`;
        el.style.minHeight = `${cell.minHeight}px`;

        el.focus();
      },
      setValue(value: string) {
        store.setValue(value);
        selectionService.setValue(store.getParsedValue(), store.getIsRaw());
      },
      setIsRaw(isRaw: boolean) {
        store.setIsRaw(isRaw);
        selectionService.setValue(store.getParsedValue(), isRaw);
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

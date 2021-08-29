import { useMemo } from 'react';
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
  const store = useFloatingInputStore();

  const service = useMemo(
    () => ({
      getIsRaw: () => store.isRaw,
      getValue: () => store.value,
      getCell: () => store.cell,
      isSingleCell: () => {
        const columnsCount = tableDataService.getFields()?.length;
        const rowsCount = tableDataService.getRows()?.length;
        return (
          !columnsCount || !rowsCount || (columnsCount === 1 && rowsCount === 1)
        );
      },
      focus() {
        const focusedCell = selectionService.getFocusedDataCell();
        if (!focusedCell) return;

        const { row, column } = focusedCell;

        service.setCell({ row, column });
      },
      setCell(cell?: { row: number; column: number }) {
        if (!cell) {
          store.setCell();
          return;
        }

        const td = tableService.getCell(cell.row, cell.column);
        if (!td) {
          store.setCell();
          return;
        }

        store.setCell({
          row: cell.row,
          column: cell.column,
          offsetTop: td.offsetTop,
          offsetLeft: td.offsetLeft,
          minWidth: td.offsetWidth,
          minHeight: td.offsetHeight,
          className: (td.dataset as { bgClass: string }).bgClass,
        });

        store.setValue(dataChangesService.getValue(cell.row, cell.column));
      },
      getPlaceholder() {
        const { cell } = store;
        if (!cell) return;

        const defaults = tableDataService.getDefaults();
        const defaultValue = defaults && defaults[cell.column];

        const fields = tableDataService.getFields();
        const field = fields && fields[cell.column];

        return store.value === null || store.isRaw
          ? defaultValue || (!field?.isNullable ? 'required' : 'null')
          : 'empty';
      },
      setValue(value: string) {
        store.setValue(value);
        selectionService.setValue(value, store.isRaw);
      },
      setIsRaw(isRaw: boolean) {
        store.setIsRaw(isRaw);
        selectionService.setValue(store.value, isRaw);
      },
      focusPrev() {
        service.focusOther('prev');
      },
      focusNext() {
        service.focusOther('next');
      },
      focusOther(type: 'prev' | 'next') {
        const { cell } = store;
        const columnsCount = tableDataService.getFields()?.length;
        const rowsCount = tableDataService.getRows()?.length;

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

  return service;
};

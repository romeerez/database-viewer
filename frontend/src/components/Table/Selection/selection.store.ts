import { useLocalObservable } from 'mobx-react-lite';
import { TableDataService } from '../TableData/tableData.service';
import { DataChangesService } from '../DataChanges/dataChanges.service';
import { Cell, CellType } from '../Table/Table.service';

export type Selection = Record<number, Record<number, true>>;

export const useSelectionStore = ({
  tableDataService,
  dataChangesService,
}: {
  tableDataService: TableDataService;
  dataChangesService: DataChangesService;
}) => {
  const store = useLocalObservable(() => ({
    selecting: false,
    selection: {} as Selection,
    previousSelection: {} as Selection,
    selectedColumns: {} as Record<number, true>,
    selectFrom: undefined as undefined | Cell,
    selectTo: undefined as undefined | Cell,
    prevFocusedCell: undefined as undefined | Cell,
    focusedCell: undefined as undefined | Cell,
    get focusedDataCell() {
      const cell = store.focusedCell;
      if (!cell) return undefined;

      if (cell.type === CellType.cell) {
        return {
          row: cell.row,
          column: cell.column,
        };
      } else if (
        tableDataService.getFields()?.length &&
        tableDataService.getRows()?.length
      ) {
        return cell.type === CellType.column
          ? { row: 0, column: cell.column }
          : { row: cell.row, column: 0 };
      }
    },
    setValue(value: string | null, raw: boolean) {
      for (const row in store.selection) {
        for (const column in store.selection[row]) {
          dataChangesService.setValue(
            row as unknown as number,
            column as unknown as number,
            value,
            raw,
          );
        }
      }
    },
    hasSelection() {
      return Object.keys(store.selection).length > 0;
    },
    isRowSelected(row: number) {
      return Boolean(store.selection[row]);
    },
    isColumnSelected(column: number) {
      return Boolean(store.selectedColumns[column]);
    },
    isCellSelected(row: number, cell: number) {
      return Boolean(store.selection[row]?.[cell]);
    },
    isFocusedDataCell(row: number, column: number) {
      const cell = store.focusedDataCell;
      return cell ? cell.row === row && cell.column === column : false;
    },
    getRowNumbers() {
      return Object.keys(store.selection);
    },
    setSelecting(selecting: boolean) {
      store.selecting = selecting;
    },
    clearSelection() {
      store.selection = {};
      store.selectedColumns = {};
    },
    savePreviousSelection() {
      store.previousSelection = {};
      for (const row in store.selection) {
        store.previousSelection[row] = { ...store.selection[row] };
      }
    },
    setSelectFrom(cell?: Cell) {
      store.selectFrom = cell;
    },
    setSelectTo(cell?: Cell) {
      store.selectTo = cell;
    },
    setFocusedCell(cell: Cell) {
      store.prevFocusedCell = store.focusedCell;
      store.focusedCell = cell;
    },
    forEachSelectedCell(cb: (row: string, column: string) => void) {
      for (const row in store.selection) {
        for (const column in store.selection[row]) {
          cb(row, column);
        }
      }
    },
    applySelection() {
      const from = store.selectFrom;
      const to = store.selectTo;
      if (!from || !to) {
        return;
      }

      let minRow: number | undefined,
        maxRow: number | undefined,
        minColumn: number | undefined,
        maxColumn: number | undefined;

      const rowsLength = tableDataService.getRows()?.length;
      const columnsLength = tableDataService.getFields()?.length;

      if (!rowsLength || !columnsLength) return;

      if (from.type === CellType.row || to.type === CellType.row) {
        minColumn = 0;
        maxColumn = columnsLength;
      }

      if (from.type === CellType.column || to.type === CellType.column) {
        minRow = 0;
        maxRow = rowsLength;
      }

      if ('row' in from && 'row' in to) {
        minRow = Math.min(from.row, to.row);
        maxRow = Math.max(from.row, to.row);
      }

      if ('column' in from && 'column' in to) {
        minColumn = Math.min(from.column, to.column);
        maxColumn = Math.max(from.column, to.column);
      }

      if (
        minRow === undefined ||
        maxRow === undefined ||
        minColumn === undefined ||
        maxColumn === undefined
      ) {
        return;
      }

      const selection: Selection = {};
      for (const row in store.previousSelection) {
        selection[row] = { ...store.previousSelection[row] };
      }

      for (let row = minRow; row <= maxRow; row++) {
        const columns: Record<number, true> = selection[row] || {};
        selection[row] = columns;
        for (let column = minColumn; column <= maxColumn; column++) {
          columns[column] = true;
        }
      }

      store.selection = selection;
      store.selectedColumns = {};

      if (Object.keys(selection).length < rowsLength) return;

      for (let column = 0; column < columnsLength; column++) {
        let selectedInAllRows = true;
        for (let row = 0; row < rowsLength; row++) {
          if (!selection[row][column]) {
            selectedInAllRows = false;
            break;
          }
        }
        if (selectedInAllRows) {
          store.selectedColumns[column] = true;
        }
      }
    },
  }));

  return store;
};

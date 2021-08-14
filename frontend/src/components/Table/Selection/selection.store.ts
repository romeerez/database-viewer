import { useLocalObservable } from 'mobx-react-lite';
import { TableDataService } from '../../../components/Table/TableData/tableData.service';
import { DataChangesService } from '../../../components/Table/DataChanges/dataChanges.service';

export type Selection = Record<number, Record<number, true>>;

export enum CellType {
  row = 'row',
  column = 'column',
  cell = 'cell',
}

export type Cell =
  | {
      type: CellType.cell;
      rowIndex: number;
      columnIndex: number;
    }
  | {
      type: CellType.row;
      rowIndex: number;
    }
  | {
      type: CellType.column;
      columnIndex: number;
    };

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
    focusedCell: undefined as undefined | Cell,
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
    setSelectTo(cell: Cell) {
      store.selectTo = cell;
    },
    setFocusedCell(cell: Cell) {
      store.focusedCell = cell;
    },
    forEachSelectedCell(cb: (row: string, column: string) => void) {
      for (const row in store.selection) {
        for (const column in store.selection[row]) {
          cb(row, column);
        }
      }
    },
    applySelection(from: Cell, to: Cell) {
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

      if ('rowIndex' in from && 'rowIndex' in to) {
        minRow = Math.min(from.rowIndex, to.rowIndex);
        maxRow = Math.max(from.rowIndex, to.rowIndex);
      }

      if ('columnIndex' in from && 'columnIndex' in to) {
        minColumn = Math.min(from.columnIndex, to.columnIndex);
        maxColumn = Math.max(from.columnIndex, to.columnIndex);
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

import { TableDataService } from '../TableData/tableData.service';
import { DataChangesService } from '../DataChanges/dataChanges.service';
import { Cell, CellType } from '../Table/Table.service';
import { computed, useCreateStore } from 'jastaman';

export type Selection = Record<number, Record<number, true>>;

export const useSelectionStore = ({
  tableDataService,
  dataChangesService,
}: {
  tableDataService: TableDataService;
  dataChangesService: DataChangesService;
}) => {
  const store = useCreateStore(() => ({
    state: {
      selecting: false,
      selection: {} as Selection,
      previousSelection: {} as Selection,
      selectedColumns: {} as Record<number, true>,
      selectFrom: undefined as undefined | Cell,
      selectTo: undefined as undefined | Cell,
      prevFocusedCell: undefined as undefined | Cell,
      focusedCell: undefined as undefined | Cell,
      dataChanges: {
        newRowsMap: dataChangesService.state.newRowsMap,
        removedRowsMap: dataChangesService.state.removedRowsMap,
        changesMap: dataChangesService.state.changesMap,
      },
      tableData: {
        fields: tableDataService.state.fields,
        rows: tableDataService.state.rows,
      },
      hasChangesInSelection: computed<boolean>(),
      focusedDataCell: computed<{ row: number; column: number } | undefined>(),
      hasSelection: computed<boolean>(),
    },
    computed: {
      hasChangesInSelection: [
        (state) => [state.selection, state.dataChanges],
        ({ selection, dataChanges }) => {
          for (const row in selection) {
            if (
              dataChanges.newRowsMap[row] ||
              dataChanges.removedRowsMap[row]
            ) {
              return true;
            }

            for (const column in selection[row]) {
              if (dataChanges.changesMap[row]?.[column]) {
                return true;
              }
            }
          }

          return false;
        },
      ],
      focusedDataCell: [
        (state) => [state.focusedCell, state.tableData],
        ({ focusedCell: cell, tableData }) => {
          if (!cell) return undefined;

          if (cell.type === CellType.cell) {
            return {
              row: cell.row,
              column: cell.column,
            };
          } else if (tableData.fields?.length && tableData.rows?.length) {
            return cell.type === CellType.column
              ? { row: 0, column: cell.column }
              : { row: cell.row, column: 0 };
          }
        },
      ],
      hasSelection: [
        (state) => state.selection,
        (state) => Object.keys(state.selection).length > 0,
      ],
    },
    getChangesInfo() {
      const { selection, dataChanges } = store.state;

      const result: {
        add: string[];
        remove: string[];
        change: Record<string, string[]>;
      } = { add: [], remove: [], change: {} };
      const { add, remove, change } = result;

      for (const row in selection) {
        if (dataChanges.newRowsMap[row]) {
          add.push(row);
          continue;
        } else if (dataChanges.removedRowsMap[row]) {
          remove.push(row);
          continue;
        }

        for (const column in selection[row]) {
          if (dataChanges.changesMap[row]?.[column]) {
            if (!change[row]) change[row] = [];
            change[row].push(column);
          }
        }
      }

      return result;
    },
    reset() {
      store.set({
        selecting: false,
        selection: {},
        previousSelection: {},
        selectedColumns: {},
        selectFrom: undefined,
        selectTo: undefined,
        prevFocusedCell: undefined,
        focusedCell: undefined,
      });
    },
    setValue(value: string | null, raw: boolean) {
      for (const row in store.state.selection) {
        for (const column in store.state.selection[row]) {
          dataChangesService.setValue(
            row as unknown as number,
            column as unknown as number,
            value,
            raw,
          );
        }
      }
    },
    useIsRowSelected(row: number) {
      return store.use((state) => Boolean(state.selection[row]), [row]);
    },
    useIsColumnSelected(column: number) {
      return store.use(
        (state) => Boolean(state.selectedColumns[column]),
        [column],
      );
    },
    useIsCellSelected(row: number, cell: number) {
      return store.use(
        (state) => Boolean(state.selection[row]?.[cell]),
        [row, cell],
      );
    },
    useIsFocusedDataCell(row: number, column: number) {
      return store.use(
        (state) => {
          const cell = state.focusedDataCell;
          return cell ? cell.row === row && cell.column === column : false;
        },
        [row, column],
      );
    },
    getRowNumbers() {
      return Object.keys(store.state.selection);
    },
    setSelecting(selecting: boolean) {
      store.set({ selecting });
    },
    clearSelection() {
      store.set({ selection: {}, selectedColumns: {} });
    },
    savePreviousSelection() {
      const { selection } = store.state;
      const previousSelection: Selection = {};
      for (const row in selection) {
        previousSelection[row] = { ...selection[row] };
      }
      store.set({ previousSelection });
    },
    setSelectFrom(selectFrom?: Cell) {
      store.set({ selectFrom });
    },
    setSelectTo(selectTo?: Cell) {
      store.set({ selectTo });
    },
    setFocusedCell(focusedCell: Cell) {
      store.set((state) => ({
        prevFocusedCell: state.focusedCell,
        focusedCell,
      }));
    },
    forEachSelectedCell(cb: (row: string, column: string) => void) {
      const { selection } = store.state;
      for (const row in selection) {
        for (const column in selection[row]) {
          cb(row, column);
        }
      }
    },
    applySelection() {
      const {
        selectFrom: from,
        selectTo: to,
        tableData,
        previousSelection,
      } = store.state;
      const rowsLength = tableData.rows?.length;
      const columnsLength = tableData.fields?.length;
      if (!from || !to || !rowsLength || !columnsLength) {
        return;
      }

      let minRow: number | undefined,
        maxRow: number | undefined,
        minColumn: number | undefined,
        maxColumn: number | undefined;

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
      for (const row in previousSelection) {
        selection[row] = { ...previousSelection[row] };
      }

      for (let row = minRow; row <= maxRow; row++) {
        const columns: Record<number, true> = selection[row] || {};
        selection[row] = columns;
        for (let column = minColumn; column <= maxColumn; column++) {
          columns[column] = true;
        }
      }

      const selectedColumns: Record<string, true> = {};

      if (Object.keys(selection).length >= rowsLength) {
        for (let column = 0; column < columnsLength; column++) {
          let selectedInAllRows = true;
          for (let row = 0; row < rowsLength; row++) {
            if (!selection[row][column]) {
              selectedInAllRows = false;
              break;
            }
          }
          if (selectedInAllRows) {
            selectedColumns[column] = true;
          }
        }
      }

      store.set({ selection, selectedColumns });
    },
  }));

  dataChangesService.useEffect(
    (state) => ({
      newRowsMap: state.newRowsMap,
      removedRowsMap: state.removedRowsMap,
      changesMap: state.changesMap,
    }),
    (slice) => store.set({ dataChanges: slice }),
  );

  tableDataService.useEffect(
    (state) => ({
      fields: state.fields,
      rows: state.rows,
    }),
    (slice) => store.set({ tableData: slice }),
  );

  return store;
};

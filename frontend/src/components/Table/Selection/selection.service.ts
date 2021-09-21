import { useSelectionStore } from './selection.store';
import { TableDataService } from '../TableData/tableData.service';
import { DataChangesService } from '../DataChanges/dataChanges.service';
import { Cell, CellType } from '../Table/Table.service';
import { useEffect, useMemo } from 'react';

type SelectionStore = ReturnType<typeof useSelectionStore>;

export type SelectionService = ReturnType<typeof useSelectionService>;

export const useSelectionService = ({
  tableDataService,
  dataChangesService,
  floatingInputService,
}: {
  tableDataService: TableDataService;
  dataChangesService: DataChangesService;
  floatingInputService(): { focus(): void };
}) => {
  const store = useSelectionStore({ tableDataService, dataChangesService });

  const service = useMemo(
    () => ({
      ...store,
      getRowProps(row: number) {
        return {
          'data-selection-type': CellType.row,
          'data-selection-row': row,
        };
      },
      getColumnProps(column: number) {
        return {
          'data-selection-type': CellType.column,
          'data-selection-column': column,
        };
      },
      getCellProps(row: number, column: number) {
        return {
          'data-selection-type': CellType.cell,
          'data-selection-row': row,
          'data-selection-column': column,
        };
      },
      startSelection({
        cell,
        addToSelection,
        continueSelection,
      }: {
        cell?: Cell;
        addToSelection: boolean;
        continueSelection: boolean;
      }) {
        store.setSelecting(true);
        if (!addToSelection) {
          store.clearSelection();
        }

        if (!cell) return;

        store.savePreviousSelection();
        const cellFrom = (continueSelection && store.state.focusedCell) || cell;
        store.setSelectFrom(cellFrom);

        if (!continueSelection || !store.state.focusedCell) {
          store.setFocusedCell(cell);
        }

        store.setSelectTo(cell);
        store.applySelection();
      },
      moveSelection({
        cell,
        continueSelection,
      }: {
        cell?: Cell;
        continueSelection: boolean;
      }) {
        if (!cell || !store.state.selecting) return;

        if (!store.state.selectFrom) {
          store.savePreviousSelection();
          const cellFrom =
            (continueSelection && store.state.focusedCell) || cell;
          store.setSelectFrom(cellFrom);

          if (!continueSelection || !store.state.focusedCell) {
            store.setFocusedCell(cell);
          }
        }

        store.setSelectTo(cell);
        store.applySelection();
      },
      moveSelectionToDirection(
        dir: 'up' | 'right' | 'down' | 'left',
        continueSelection: boolean,
      ) {
        const { focusedCell, selectTo } = store.state;
        const cell = selectTo || focusedCell;
        if (!focusedCell || !cell) return;

        let row = 'row' in cell ? cell.row : -1;
        let column = 'column' in cell ? cell.column : -1;

        if (dir === 'up') row--;
        else if (dir === 'right') column++;
        else if (dir === 'down') row++;
        else column--;

        const { rows, fields } = tableDataService.state;
        if (
          rows &&
          fields &&
          row > -2 &&
          column > -2 &&
          row < rows.length &&
          column < fields.length
        ) {
          const current: Cell =
            row === -1
              ? {
                  type: CellType.column,
                  column,
                }
              : column === -1
              ? {
                  type: CellType.row,
                  row,
                }
              : {
                  type: CellType.cell,
                  row,
                  column,
                };

          if (continueSelection) {
            store.setSelectTo(current);
            store.applySelection();
          } else {
            store.setFocusedCell(current);
            store.setSelectFrom(current);
            store.setSelectTo(current);
            store.applySelection();
          }
        }
      },
      endSelection({ cell }: { cell?: Cell }) {
        store.setSelecting(false);
        store.setSelectTo(cell);
        store.applySelection();
        store.setSelectFrom(undefined);

        const prev = store.state.prevFocusedCell;
        if (
          prev &&
          cell &&
          'row' in prev &&
          'row' in cell &&
          prev.row === cell.row &&
          'column' in prev &&
          'column' in cell &&
          prev.column === cell.column
        ) {
          floatingInputService().focus();
        }
      },
      selectAndFocusCell(row: number, column: number) {
        store.clearSelection();

        const cell = {
          type: CellType.cell,
          row,
          column,
        };
        store.savePreviousSelection();
        store.setSelectFrom(cell);
        store.setSelectTo(cell);
        store.setFocusedCell(cell);
        store.applySelection();
      },
      removeRows() {
        dataChangesService.removeRows(store.getRowNumbers());
      },
      revertSelected() {
        store.forEachSelectedCell((row, column) => {
          dataChangesService.revertCell(row, column);
        });
      },
    }),
    [store, dataChangesService, floatingInputService, tableDataService],
  );

  const rows = tableDataService.use((state) => state.rows);
  useEffect(() => store.reset(), [store, rows]);

  return service;
};

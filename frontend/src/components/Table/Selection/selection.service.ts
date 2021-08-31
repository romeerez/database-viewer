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
      hasSelection: store.hasSelection,
      isRowSelected: store.isRowSelected,
      isColumnSelected: store.isColumnSelected,
      isFocusedDataCell: store.isFocusedDataCell,
      isCellSelected: store.isCellSelected,
      setValue: store.setValue,
      clearSelection: store.clearSelection,
      getChangeInfo: store.getChangeInfo,
      getHasChangesInSelection: () => store.hasChangesInSelection,
      getFocusedCell: () => store.focusedCell,
      getFocusedDataCell: () => store.focusedDataCell,
      getIsSelecting: () => store.selecting,
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
        const cellFrom = (continueSelection && store.focusedCell) || cell;
        store.setSelectFrom(cellFrom);

        if (!continueSelection || !store.focusedCell) {
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
        if (!cell || !store.selecting) return;

        if (!store.selectFrom) {
          store.savePreviousSelection();
          const cellFrom = (continueSelection && store.focusedCell) || cell;
          store.setSelectFrom(cellFrom);

          if (!continueSelection || !store.focusedCell) {
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
        const { focusedCell } = store;
        const cell = store.selectTo || focusedCell;
        if (!focusedCell || !cell) return;

        let row = 'row' in cell ? cell.row : -1;
        let column = 'column' in cell ? cell.column : -1;

        if (dir === 'up') row--;
        else if (dir === 'right') column++;
        else if (dir === 'down') row++;
        else column--;

        const rows = tableDataService.getRows();
        const fields = tableDataService.getFields();
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

        const prev = store.prevFocusedCell;
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

  const rows = tableDataService.getRows();
  useEffect(() => store.reset(), [store, rows]);

  return service;
};

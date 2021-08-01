import {
  Cell,
  CellType,
  useSelectionStore,
} from '../../../components/Table/Selection/selection.store';
import { TableDataService } from '../../../components/Table/TableData/tableData.service';
import { DataChangesService } from '../../../components/Table/DataChanges/dataChanges.service';

type SelectionStore = ReturnType<typeof useSelectionStore>;

export type SelectionService = ReturnType<typeof useSelectionService>;

export const useSelectionService = ({
  tableDataService,
  dataChangesService,
}: {
  tableDataService: TableDataService;
  dataChangesService: DataChangesService;
}) => {
  const store = useSelectionStore({ tableDataService, dataChangesService });

  return {
    hasSelection: store.hasSelection,
    isRowSelected: store.isRowSelected,
    isColumnSelected: store.isColumnSelected,
    isCellSelected: store.isCellSelected,
    setValue: store.setValue,
    clearSelection: store.clearSelection,
    getFocusedCell: () => store.focusedCell,
    getRowProps(rowIndex: number) {
      return {
        'data-selection-type': CellType.row,
        'data-selection-row': rowIndex,
      };
    },
    getColumnProps(columnIndex: number) {
      return {
        'data-selection-type': CellType.column,
        'data-selection-column': columnIndex,
      };
    },
    getCellProps(rowIndex: number, columnIndex: number) {
      return {
        'data-selection-type': CellType.cell,
        'data-selection-row': rowIndex,
        'data-selection-column': columnIndex,
      };
    },
    startSelection({
      cell,
      addToSelection,
      continueSelection,
      focus,
    }: {
      cell?: Cell;
      addToSelection: boolean;
      continueSelection: boolean;
      focus(): void;
    }) {
      store.setSelecting(true);
      if (!addToSelection) {
        store.clearSelection();
      }

      if (!cell) return;

      startSelection({ store, cell, continueSelection, focus });
      expandSelection({ store, cell });
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
        startSelection({ store, cell, continueSelection, focus });
      }

      expandSelection({ store, cell });
    },
    endSelection({ cell }: { cell?: Cell }) {
      store.setSelecting(false);

      expandSelection({ store, cell });

      store.setSelectFrom(undefined);
    },
    selectAndFocusCell(rowIndex: number, columnIndex: number) {
      store.clearSelection();

      const cell = {
        type: CellType.cell,
        rowIndex,
        columnIndex,
      };
      store.savePreviousSelection();
      store.setSelectFrom(cell);
      store.setFocusedCell(cell);
      store.applySelection(cell, cell);
    },
    removeRows() {
      dataChangesService.removeRows(store.getRowNumbers());
    },
    revertSelected() {
      store.forEachSelectedCell((row, column) => {
        dataChangesService.revertCell(row, column);
      });
    },
  };
};

const startSelection = ({
  store,
  cell,
  continueSelection,
  focus,
}: {
  store: SelectionStore;
  cell: Cell;
  continueSelection: boolean;
  focus(): void;
}) => {
  store.savePreviousSelection();

  const cellFrom = (continueSelection && store.focusedCell) || cell;
  store.setSelectFrom(cellFrom);

  if (!continueSelection || !store.focusedCell) {
    store.setFocusedCell(cellFrom);
    focus();
  }
};

const expandSelection = ({
  store,
  cell,
}: {
  store: SelectionStore;
  cell?: Cell;
}) => {
  const { selectFrom } = store;
  if (selectFrom && cell) {
    store.applySelection(selectFrom, cell);
  }
};

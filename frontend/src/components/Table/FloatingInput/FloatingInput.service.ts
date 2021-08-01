import { useMemo } from 'react';
import {
  Cell,
  useFloatingInputStore,
} from '../../../components/Table/FloatingInput/FloatingInput.store';
import { TableDataService } from '../../../components/Table/TableData/tableData.service';
import { SelectionService } from '../../../components/Table/Selection/selection.service';
import { DataChangesService } from '../../../components/Table/DataChanges/dataChanges.service';

export type FloatingInputService = ReturnType<typeof useFloatingInputService>;

export const useFloatingInputService = ({
  tableDataService,
  dataChangesService,
  selectionService,
}: {
  tableDataService: TableDataService;
  dataChangesService: DataChangesService;
  selectionService: SelectionService;
}) => {
  const store = useFloatingInputStore();

  const service = useMemo(
    () => ({
      setCell(cell: Cell) {
        store.setCell(cell);
        store.setValue(
          dataChangesService.getValue(cell.row, cell.column) || '',
        );
        service.cancelBlur();
        service.showInputs();

        const focused = selectionService.getFocusedCell();
        const focusedRow = focused && 'rowIndex' in focused && focused.rowIndex;
        const focusedColumn =
          focused && 'columnIndex' in focused && focused.columnIndex;

        if (focusedRow !== cell.row || focusedColumn !== cell.column) {
          selectionService.selectAndFocusCell(cell.row, cell.column);
        }
      },
      setPreventBlur: store.setPreventBlur,
      getIsNullAllowed: () => store.isEmptyAllowed,
      getValue: () => store.value,
      getShowInputs: () => store.showInputs,
      getCell: () => store.cell,
      getPlaceholder() {
        const { cell } = store;
        if (!cell) return;

        const defaults = tableDataService.getDefaults();
        const defaultValue = defaults && defaults[cell.column];

        const fields = tableDataService.getFields();
        const field = fields && fields[cell.column];

        return store.isEmptyAllowed
          ? 'empty'
          : defaultValue || (!field?.isNullable ? 'required' : 'null');
      },
      setValue(valueString: string) {
        store.setValue(valueString);
        const value = valueString || (store.isEmptyAllowed ? '' : null);
        selectionService.setValue(value);
      },
      setIsEmptyAllowed(isEmptyAllowed: boolean) {
        store.setIsEmptyAllowed(isEmptyAllowed);
        service.setValue(store.value);
      },
      initBlur() {
        store.setBlurTimeout(setTimeout(service.onBlur, 50));
      },
      cancelBlur() {
        const timeout = store.blurTimeout;
        if (timeout) {
          store.setBlurTimeout(undefined);
          clearTimeout(timeout);
        }
      },
      onBlur() {
        if (store.preventBlur) return;

        selectionService.clearSelection();
        store.setShowInputs(false);
      },
      showInputs() {
        store.setShowInputs(true);
      },
    }),
    [store, tableDataService],
  );

  return service;
};

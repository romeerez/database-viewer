import { useMemo } from 'react';
import { useDataChangesStore } from '../../../components/Table/DataChanges/dataChanges.store';
import { TableDataService } from '../../../components/Table/TableData/tableData.service';

export type DataChangesService = ReturnType<typeof useDataChangesService>;

export const useDataChangesService = ({
  tableDataService,
}: {
  tableDataService: TableDataService;
}) => {
  const store = useDataChangesStore({ tableDataService });

  return useMemo(
    () => ({
      getValue: store.getValue,
      getIsRaw: store.getIsRaw,
      setValue: store.setValue,
      removeRows: store.removeRows,
      getRemovedRows: store.getRemovedRows,
      getRowChanges: store.getRowChanges,
      getNewRows: store.getNewRows,
      addRow() {
        const fields = tableDataService.getFields();
        const rows = tableDataService.getRows();
        if (!fields || !rows) return;

        store.setNewRow(rows.length);

        const row = new Array(fields.length).fill(null);
        store.addRow(row);
      },
      hasChanges() {
        return (
          Object.keys(store.removedRows).length > 0 ||
          Object.keys(store.changes).length > 0 ||
          Object.keys(store.newRows).length > 0
        );
      },
      isRowRemoved(rowIndex: number) {
        return Boolean(store.removedRows[rowIndex]);
      },
      isRowChanged(rowIndex: number) {
        return Boolean(store.changes[rowIndex]);
      },
      isValueChanged(rowIndex: number, columnIndex: number) {
        return store.changes[rowIndex]?.[columnIndex] !== undefined;
      },
      isNewRow(rowIndex: number) {
        return store.newRows[rowIndex] || false;
      },
      revertCell(row: string, column: string) {
        if (store.removedRows[row]) {
          delete store.removedRows[row];
        } else if (store.changes[row]?.[column]) {
          delete store.changes[row][column];
          if (!Object.keys(store.changes[row]).length) {
            delete store.changes[row];
          }
        } else if (store.newRows[row]) {
          const rowIndex = parseInt(row);
          const rows = tableDataService
            .getRows()
            ?.filter((_, i) => i !== rowIndex);
          if (!rows) return;

          tableDataService.setRows(rows);
          delete store.newRows[rows.length];
        }
      },
    }),
    [store, tableDataService],
  );
};

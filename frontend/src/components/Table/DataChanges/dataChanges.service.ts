import { useEffect, useMemo } from 'react';
import { useDataChangesStore } from './dataChanges.store';
import { TableDataService } from '../TableData/tableData.service';
import { buildTransaction } from '../../../lib/queryBuilder';
import { useAPIContext } from '../../../lib/apiContext';
import { toast } from 'react-toastify';
import { ErrorService } from '../Error/error.service';

export type DataChangesService = ReturnType<typeof useDataChangesService>;

export const useDataChangesService = ({
  tableDataService,
  errorService,
}: {
  tableDataService: TableDataService;
  errorService: ErrorService;
}) => {
  const store = useDataChangesStore({ tableDataService });
  const { useQueryRowsLazyQuery } = useAPIContext();

  const service = useMemo(
    () => ({
      getValue: store.getValue,
      getIsRaw: store.getIsRaw,
      setValue: store.setValue,
      removeRows: store.removeRows,
      getRemovedRows: store.getRemovedRows,
      getRowChanges: store.getRowChanges,
      getNewRows: store.getNewRows,
      unmarkRemovedRows: store.unmarkRemovedRows,
      undoChanges: store.undoChanges,
      hasChanges: () => store.hasChanges,
      getIsLoading: () => store.isLoading,
      addRow() {
        const fields = tableDataService.getFields();
        const rows = tableDataService.getRows();
        if (!fields || !rows) return;

        store.setNewRow(rows.length);

        const row = new Array(fields.length).fill(null);
        store.addRow(row);
      },
      isRowRemoved(rowIndex: number | string) {
        return Boolean(store.removedRows[rowIndex]);
      },
      isRowChanged(rowIndex: number) {
        return Boolean(store.changes[rowIndex]);
      },
      isValueChanged(rowIndex: number | string, columnIndex: number | string) {
        return store.changes[rowIndex]?.[columnIndex] !== undefined;
      },
      isNewRow(rowIndex: number | string) {
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
      getChangesQuery() {
        const removedRows = service.getRemovedRows();
        const rowChanges = service.getRowChanges();
        const newRows = service.getNewRows();
        const primaryColumns = tableDataService.getPrimaryColumns();
        const { schemaName, tableName } = tableDataService.getParams();
        const fields = tableDataService.getFields();
        const defaults = tableDataService.getDefaults();

        if (!fields || !defaults) return '';

        return buildTransaction({
          schemaName,
          tableName,
          primaryColumns,
          fields,
          defaults,
          removedRows,
          rowChanges,
          newRows,
        });
      },
      submitUpdate(query: string) {
        const databaseUrl = tableDataService.getDatabaseUrl();
        if (query.length === 0 || !databaseUrl) {
          return;
        }

        store.setIsLoading(true);
        executeQuery({
          variables: {
            url: databaseUrl,
            query,
          },
        });
      },
    }),
    [store, tableDataService],
  );

  const [executeQuery] = useQueryRowsLazyQuery({
    fetchPolicy: 'no-cache',
    onCompleted() {
      errorService.setError();
      tableDataService.sync();
      toast('Success', { type: 'success' });
      store.setIsLoading(false);
    },
    onError(error) {
      errorService.setError(error.message);
      store.setIsLoading(false);
    },
  });

  const rows = tableDataService.getRows();
  useEffect(() => store.reset(), [rows, store]);

  return service;
};

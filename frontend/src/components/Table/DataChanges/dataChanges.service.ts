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
      ...store,
      addRow() {
        const { fields, rows } = tableDataService.state;
        if (!fields || !rows) return;

        store.setNewRow(rows.length);

        const row = new Array(fields.length).fill(null);
        store.addRow(row);
      },
      useIsRowRemoved(rowIndex: number | string) {
        return store.use(
          (state) => Boolean(state.removedRowsMap[rowIndex]),
          [rowIndex],
        );
      },
      useIsRowChanged(rowIndex: number) {
        return store.use(
          (state) => Boolean(state.changesMap[rowIndex]),
          [rowIndex],
        );
      },
      useIsValueChanged(
        rowIndex: number | string,
        columnIndex: number | string,
      ) {
        return store.use(
          (state) => state.changesMap[rowIndex]?.[columnIndex] !== undefined,
          [rowIndex, columnIndex],
        );
      },
      useIsNewRow(rowIndex: number | string) {
        return store.use((state) => state.newRowsMap[rowIndex] || false);
      },
      revertCell(row: string, column: string) {
        let { removedRowsMap, changesMap, newRowsMap } = store.state;
        if (removedRowsMap[row]) {
          removedRowsMap = { ...removedRowsMap };
          delete removedRowsMap[row];
          store.set({ removedRowsMap });
        } else if (changesMap[row]?.[column]) {
          changesMap = { ...changesMap, [row]: { ...changesMap[row] } };
          delete changesMap[row][column];
          if (!Object.keys(changesMap[row]).length) {
            delete changesMap[row];
          }
          store.set({ changesMap });
        } else if (newRowsMap[row]) {
          const rowIndex = parseInt(row);
          const rows = tableDataService.state.rows?.filter(
            (_, i) => i !== rowIndex,
          );
          if (!rows) return;

          tableDataService.setRows(rows);
          newRowsMap = { ...newRowsMap };
          delete newRowsMap[rows.length];
          store.set({ newRowsMap });
        }
      },
      getChangesQuery() {
        const { removedRows, rowChanges, newRows } = store.state;
        const {
          fields,
          defaults,
          params: { schemaName, tableName },
          primaryColumns,
        } = tableDataService.state;

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
        const { databaseUrl } = tableDataService.state;
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

  const rows = tableDataService.use((state) => state.rows);
  useEffect(() => store.reset(), [rows, store]);

  return service;
};

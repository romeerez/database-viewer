import { useTableDataStore } from './tableData.store';
import { useMemo } from 'react';
import { buildQuery } from '../../../lib/queryBuilder';
import { useAPIContext } from '../../../lib/apiContext';
import { ErrorService } from '../Error/error.service';

export type TableDataService = ReturnType<typeof useDataService>;

export const useDataService = ({
  errorService,
}: {
  errorService: ErrorService;
}) => {
  const store = useTableDataStore();

  const service = useMemo(
    () => ({
      ...store,
      loadFieldsAndRows() {
        const { databaseUrl, params, queryParams } = store.state;
        if (!databaseUrl) return;

        loadFieldsAndRows({
          variables: {
            url: databaseUrl,
            query: buildQuery({
              schemaName: params.schemaName,
              tableName: params.tableName,
              count: false,
              ...queryParams,
            }),
          },
        });
      },
      loadCount() {
        const { databaseUrl, params, queryParams } = store.state;
        if (!databaseUrl) return;

        loadCount({
          variables: {
            url: databaseUrl,
            query: buildQuery({
              schemaName: params.schemaName,
              tableName: params.tableName,
              count: true,
              ...queryParams,
            }),
          },
        });
      },
      loadRows() {
        const { databaseUrl, params, queryParams } = store.state;
        if (!databaseUrl) return;

        loadRows({
          variables: {
            url: databaseUrl,
            query: buildQuery({
              schemaName: params.schemaName,
              tableName: params.tableName,
              count: false,
              ...queryParams,
            }),
          },
        });
      },
      setLimit(value?: number) {
        store.updateQueryParams({ limit: value, offset: 0 });
        service.loadRows();
      },
      setOffset(value: number) {
        store.updateQueryParams({ offset: value });
        service.loadRows();
      },
      setOrderBy(value: string) {
        store.updateQueryParams({ orderBy: value });
        service.loadRows();
      },
      setWhere(value: string) {
        store.updateQueryParams({ where: value });
        service.loadRows();
        service.loadCount();
      },
      sync() {
        service.loadRows();
        service.loadCount();
      },
      addRow(row: string[]) {
        store.set((state) => ({ rows: [...(state.rows || []), row] }));
      },
    }),
    [store],
  );

  const { useQueryFieldsAndRowsLazyQuery, useQueryRowsLazyQuery } =
    useAPIContext();

  const [loadFieldsAndRows] = useQueryFieldsAndRowsLazyQuery({
    fetchPolicy: 'no-cache',
    onCompleted(data) {
      const result = data.executeQuery;
      store.set({ rawFields: result.fields, rows: result.rows });
      errorService.setError();
    },
    onError(error) {
      errorService.setError(error.message);
    },
  });

  const [loadCount] = useQueryRowsLazyQuery({
    fetchPolicy: 'no-cache',
    onCompleted(data) {
      const count = data.executeQuery.rows[0][0];
      store.set({ count: count ? parseInt(count) : 0 });
    },
    onError(error) {
      errorService.setError(error.message);
    },
  });

  const [loadRows] = useQueryRowsLazyQuery({
    fetchPolicy: 'no-cache',
    onCompleted(data) {
      store.set({ rows: data.executeQuery.rows });
      errorService.setError();
    },
    onError(error) {
      errorService.setError(error.message);
    },
  });

  store.useEffect(
    (state) => state.sourceUrl,
    () => {
      service.loadFieldsAndRows();
      service.loadCount();
    },
  );

  return service;
};

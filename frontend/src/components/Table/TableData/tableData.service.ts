import { useDataStore } from './tableData.store';
import { useEffect, useMemo } from 'react';
import { buildQuery } from '../../../lib/queryBuilder';
import { useAPIContext } from '../../../lib/apiContext';
import { ErrorService } from '../Error/error.service';

export type TableDataService = ReturnType<typeof useDataService>;

export const useDataService = ({
  errorService,
}: {
  errorService: ErrorService;
}) => {
  const store = useDataStore();

  const service = useMemo(
    () => ({
      setRows: store.setRows,
      getTable: () => store.table,
      getParams: () => store.params,
      getRows: () => store.rows,
      getFields: () => store.fields,
      getCount: () => store.count,
      getQueryParams: () => store.queryParams,
      getSourceUrl: () => store.sourceUrl,
      getDefaults: () => store.defaults,
      getPrimaryColumns: () => store.primaryColumns,
      getDatabaseUrl: () => store.databaseUrl,
      loadFieldsAndRows() {
        const { databaseUrl, params } = store;
        if (!databaseUrl) return;

        loadFieldsAndRows({
          variables: {
            url: databaseUrl,
            query: buildQuery({
              schemaName: params.schemaName,
              tableName: params.tableName,
              count: false,
              ...store.queryParams,
            }),
          },
        });
      },
      loadCount() {
        const { databaseUrl, params } = store;
        if (!databaseUrl) return;

        loadCount({
          variables: {
            url: databaseUrl,
            query: buildQuery({
              schemaName: params.schemaName,
              tableName: params.tableName,
              count: true,
              ...store.queryParams,
            }),
          },
        });
      },
      loadRows() {
        const { databaseUrl, params } = store;
        if (!databaseUrl) return;

        loadRows({
          variables: {
            url: databaseUrl,
            query: buildQuery({
              schemaName: params.schemaName,
              tableName: params.tableName,
              count: false,
              ...store.queryParams,
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
    }),
    [store],
  );

  const { useQueryFieldsAndRowsLazyQuery, useQueryRowsLazyQuery } =
    useAPIContext();

  const [loadFieldsAndRows] = useQueryFieldsAndRowsLazyQuery({
    fetchPolicy: 'no-cache',
    onCompleted(data) {
      const result = data.executeQuery;
      store.update({ rawFields: result.fields, rows: result.rows });
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
      store.update({ count: count ? parseInt(count) : 0 });
    },
    onError(error) {
      errorService.setError(error.message);
    },
  });

  const [loadRows] = useQueryRowsLazyQuery({
    fetchPolicy: 'no-cache',
    onCompleted(data) {
      store.update({ rows: data.executeQuery.rows });
      errorService.setError();
    },
    onError(error) {
      errorService.setError(error.message);
    },
  });

  useEffect(() => {
    service.loadFieldsAndRows();
    service.loadCount();
  }, [service, store.sourceUrl]);

  return service;
};

import { DataStore, FieldInfo } from './data.store';
import { useEffect, useMemo } from 'react';
import { buildQuery } from 'lib/queryBuilder';
import {
  useQueryFieldsAndRowsLazyQuery,
  useQueryRowsLazyQuery,
} from 'generated/graphql';

export type DataService = ReturnType<typeof useDataService>;

export const useDataService = ({ store }: { store: DataStore }) => {
  const service = useMemo(
    () => ({
      loadFieldsAndRows() {
        const { sourceUrl, params } = store;
        if (!sourceUrl) return;

        loadFieldsAndRows({
          variables: {
            url: `${sourceUrl}/${params.databaseName}`,
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
        const { sourceUrl, params } = store;
        if (!sourceUrl) return;

        loadCount({
          variables: {
            url: `${sourceUrl}/${params.databaseName}`,
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
        const { sourceUrl, params } = store;
        if (!sourceUrl) return;

        loadRows({
          variables: {
            url: `${sourceUrl}/${params.databaseName}`,
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
      addRow() {
        const { fields, rows } = store;
        if (!fields || !rows) return;

        store.setNewRow(rows.length);

        const row = new Array(fields.length).fill(null);
        store.addRow(row);
      },
      getValue: store.getValue,
      setValue: store.setValue,
    }),
    [store],
  );

  const [loadFieldsAndRows] = useQueryFieldsAndRowsLazyQuery({
    fetchPolicy: 'no-cache',
    onCompleted(data) {
      const result = data.executeQuery;
      store.update({ rawFields: result.fields, rows: result.rows });
    },
  });

  const [loadCount] = useQueryRowsLazyQuery({
    fetchPolicy: 'no-cache',
    onCompleted(data) {
      const count = data.executeQuery.rows[0][0];
      store.update({ count: count ? parseInt(count) : 0 });
    },
  });

  const [loadRows] = useQueryRowsLazyQuery({
    fetchPolicy: 'no-cache',
    onCompleted(data) {
      store.update({ rows: data.executeQuery.rows });
    },
  });

  useEffect(() => {
    service.loadFieldsAndRows();
    service.loadCount();
  }, [service, store.sourceUrl]);

  return service;
};

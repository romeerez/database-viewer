import {
  QueryResult,
  useQueryFieldsAndRowsLazyQuery,
  useQueryRowsLazyQuery,
} from 'generated/graphql';
import { useEffect, useState } from 'react';
import { useObserver } from 'mobx-react-lite';
import { dataSourcesStore } from 'components/DataSource/dataSource.store';
import { buildQuery } from 'lib/queryBuilder';

export type TableState = ReturnType<typeof useTable>;

const defaulPerPage = 10;
export const useTable = ({
  sourceName,
  databaseName,
  schemaName,
  tableName,
}: {
  sourceName: string;
  databaseName: string;
  schemaName: string;
  tableName: string;
}) => {
  const localDataSources = useObserver(() => dataSourcesStore.dataSources);
  const source = localDataSources?.find((source) => source.name === sourceName);

  const [state, setState] = useState<
    Partial<QueryResult> & {
      loading: boolean;
      where: string;
      orderBy: string;
      limit?: number;
      offset: number;
      count?: number;
    }
  >({
    loading: true,
    fields: [],
    rows: [],
    where: '',
    orderBy: '',
    limit: defaulPerPage,
    offset: 0,
  });

  const [loadFieldsAndFirst] = useQueryFieldsAndRowsLazyQuery({
    fetchPolicy: 'no-cache',
    onCompleted(data) {
      setState((state) => ({
        ...state,
        ...data.executeQuery,
        loading: state.count === undefined,
      }));
    },
  });

  const [loadCount] = useQueryRowsLazyQuery({
    fetchPolicy: 'no-cache',
    onCompleted(data) {
      const count = parseInt(data.executeQuery.rows[0][0]);

      setState((state) => ({
        ...state,
        count,
        loading: state.rows === undefined,
      }));
    },
  });

  useEffect(() => {
    if (!source) return;

    const url = `${source.url}/${databaseName}`;

    loadFieldsAndFirst({
      variables: {
        url,
        query: buildQuery({
          schemaName,
          tableName,
          ...state,
          count: false,
        }),
      },
    });

    loadCount({
      variables: {
        url,
        query: buildQuery({
          schemaName,
          tableName,
          ...state,
          count: true,
        }),
      },
    });
  }, [source]);

  const [loadRows] = useQueryRowsLazyQuery({
    fetchPolicy: 'no-cache',
    onCompleted(data) {
      setState((state) => ({
        ...state,
        loading: false,
        rows: data.executeQuery.rows,
      }));
    },
  });

  const load = (updatedState: typeof state) => {
    if (!source) return;

    loadRows({
      variables: {
        url: `${source.url}/${databaseName}`,
        query: buildQuery({
          schemaName,
          tableName,
          ...updatedState,
          count: false,
        }),
      },
    });
  };

  const updateStateAndLoad = (data: Partial<typeof state>) => {
    const updatedState = { ...state, ...data };
    setState(updatedState);
    load(updatedState);
  };

  const setLimit = (limit?: number) => updateStateAndLoad({ limit, offset: 0 });
  const setOffset = (offset?: number) => updateStateAndLoad({ offset });
  const setWhere = (where: string) => updateStateAndLoad({ where });
  const setOrderBy = (orderBy: string) => updateStateAndLoad({ orderBy });
  const reload = () => load(state);

  return {
    state,
    sourceUrl: source?.url,
    setLimit,
    setOffset,
    setWhere,
    setOrderBy,
    reload,
  };
};

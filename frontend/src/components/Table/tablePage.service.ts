import {
  QueryResult,
  useQueryFieldsAndRowsLazyQuery,
  useQueryRowsLazyQuery,
} from 'generated/graphql';
import { useEffect, useState } from 'react';
import { DataSourceInLocalStoreWithDriver } from 'components/DataSource/types';
import { buildQuery } from 'lib/queryBuilder';

export type UseTableDataProps = {
  source?: DataSourceInLocalStoreWithDriver;
  databaseName: string;
  schemaName: string;
  tableName: string;
  perPage: number;
  initialQuery: string;
  setQuery(query: string): void;
};

export const useTableData = ({
  source,
  databaseName,
  schemaName,
  tableName,
  perPage,
  initialQuery,
  setQuery,
}: UseTableDataProps) => {
  const [state, setState] = useState<
    QueryResult & { loading: boolean; loadedAll: boolean }
  >({
    loading: true,
    fields: [],
    rows: [],
    loadedAll: false,
  });

  const [loadFirst] = useQueryFieldsAndRowsLazyQuery({
    fetchPolicy: 'no-cache',
    onCompleted(data) {
      setState({
        loading: false,
        loadedAll: data.executeQuery.rows.length < perPage,
        ...data.executeQuery,
      });
    },
  });

  useEffect(() => {
    if (!source) return;

    loadFirst({
      variables: {
        url: `${source.url}/${databaseName}`,
        query: initialQuery,
      },
    });
  }, [source, initialQuery]);

  const [loadNext] = useQueryRowsLazyQuery({
    fetchPolicy: 'no-cache',
    onCompleted(data) {
      setState((state) => ({
        loading: false,
        loadedAll: data.executeQuery.rows.length < perPage,
        fields: state.fields,
        rows: [...state.rows, ...data.executeQuery.rows],
      }));
    },
  });

  const fetchNext = () => {
    if (state.loading || state.loadedAll || !source) return;

    state.loading = true;

    const query = buildQuery({
      schemaName,
      tableName,
      limit: perPage,
      offset: state.rows.length,
    });

    setQuery(query);

    loadNext({
      variables: {
        url: `${source.url}/${databaseName}`,
        query,
      },
    });
  };

  return { ...state, source, fetchNext };
};

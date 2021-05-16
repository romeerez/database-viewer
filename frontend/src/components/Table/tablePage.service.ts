import {
  QueryResult,
  useQueryFieldsAndRowsQuery,
  useQueryRowsLazyQuery,
} from 'generated/graphql';
import { useState } from 'react';
import { DataSourceInLocalStoreWithDriver } from 'components/DataSource/types';

const perPage = 30;

export const useTableData = ({
  source,
  databaseName,
  schemaName,
  tableName,
}: {
  source?: DataSourceInLocalStoreWithDriver;
  databaseName: string;
  schemaName: string;
  tableName: string;
}) => {
  const [state, setState] = useState<
    QueryResult & { loading: boolean; loadedAll: boolean }
  >({
    loading: true,
    fields: [],
    rows: [],
    loadedAll: false,
  });

  useQueryFieldsAndRowsQuery({
    fetchPolicy: 'no-cache',
    skip: !source,
    variables: {
      url: source ? `${source.url}/${databaseName}` : '',
      query: `SELECT * FROM ${schemaName}.${tableName} LIMIT ${perPage}`,
    },
    onCompleted(data) {
      setState({
        loading: false,
        loadedAll: data.executeQuery.rows.length < perPage,
        ...data.executeQuery,
      });
    },
  });

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

    loadNext({
      variables: {
        url: `${source.url}/${databaseName}`,
        query: `SELECT * FROM ${schemaName}.${tableName} LIMIT ${perPage} OFFSET ${state.rows.length}`,
      },
    });
  };

  return { ...state, source, fetchNext };
};

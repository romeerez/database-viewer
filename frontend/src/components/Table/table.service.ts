import {
  QueryResult,
  useQueryFieldsAndRowsLazyQuery,
  useQueryRowsLazyQuery,
} from 'generated/graphql';
import { useEffect, useState } from 'react';
import { useObserver } from 'mobx-react-lite';
import { dataSourcesStore } from 'components/DataSource/dataSource.store';
import { buildQuery } from 'lib/queryBuilder';

const defaulPerPage = 100;
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
    QueryResult & {
      loading: boolean;
      where: string;
      orderBy: string;
      limit: number;
      offset: number;
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
        loading: false,
      }));
    },
  });

  useEffect(() => {
    if (!source) return;

    loadFieldsAndFirst({
      variables: {
        url: `${source.url}/${databaseName}`,
        query: buildQuery({
          schemaName,
          tableName,
          ...state,
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
        }),
      },
    });
  };

  const setWhere = (where: string) => {
    const updatedState = { ...state, where };
    setState(updatedState);
    load(updatedState);
  };

  const setOrderBy = (orderBy: string) => {
    const updatedState = { ...state, orderBy };
    setState(updatedState);
    load(updatedState);
  };

  return { state, sourceUrl: source?.url, setWhere, setOrderBy };
};

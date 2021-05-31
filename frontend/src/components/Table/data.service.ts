import { DataState } from 'components/Table/data.state';
import {
  useQueryFieldsAndRowsLazyQuery,
  useQueryRowsLazyQuery,
} from 'generated/graphql';
import { buildQuery } from 'lib/queryBuilder';
import { useEffect } from 'react';
import { ParamsState } from 'components/Table/params.service';

export const useLoadInitialData = ({
  dataState,
  paramsState,
}: {
  dataState: DataState;
  paramsState: ParamsState;
}) => {
  const [loadFieldsAndFirst] = useQueryFieldsAndRowsLazyQuery({
    fetchPolicy: 'no-cache',
    onCompleted(data) {
      dataState.update({
        ...data.executeQuery,
        loading: dataState.count === undefined,
      });
    },
  });

  const [loadCount] = useQueryRowsLazyQuery({
    fetchPolicy: 'no-cache',
    onCompleted(data) {
      const count = data.executeQuery.rows[0][0];

      dataState.update({
        count: count ? parseInt(count) : 0,
        loading: dataState.rows === undefined,
      });
    },
  });

  useEffect(() => {
    if (!paramsState.sourceUrl) return;

    const url = `${paramsState.sourceUrl}/${paramsState.databaseName}`;

    loadFieldsAndFirst({
      variables: {
        url,
        query: buildQuery({
          schemaName: paramsState.schemaName,
          tableName: paramsState.tableName,
          ...dataState,
          count: false,
        }),
      },
    });

    loadCount({
      variables: {
        url,
        query: buildQuery({
          schemaName: paramsState.schemaName,
          tableName: paramsState.tableName,
          ...dataState,
          count: true,
        }),
      },
    });
  }, [paramsState.sourceUrl]);
};

export const useLoadData = ({
  dataState,
  paramsState,
}: {
  dataState: DataState;
  paramsState: ParamsState;
}) => {
  const [loadRows] = useQueryRowsLazyQuery({
    fetchPolicy: 'no-cache',
    onCompleted(data) {
      dataState.update({
        loading: false,
        rows: data.executeQuery.rows,
      });
    },
  });

  return () => {
    if (!paramsState.sourceUrl) return;

    loadRows({
      variables: {
        url: `${paramsState.sourceUrl}/${paramsState.databaseName}`,
        query: buildQuery({
          schemaName: paramsState.schemaName,
          tableName: paramsState.tableName,
          ...dataState,
          count: false,
        }),
      },
    });
  };
};

export const setLimit = (
  dataState: DataState,
  load: () => void,
  limit?: number,
) => dataState.update({ limit, offset: 0 }, load);

export const setOffset = (
  dataState: DataState,
  load: () => void,
  offset: number,
) => dataState.update({ offset }, load);

export const setWhere = (
  dataState: DataState,
  load: () => void,
  where?: string,
) => dataState.update({ where }, load);

export const setOrderBy = (
  dataState: DataState,
  load: () => void,
  orderBy?: string,
) => dataState.update({ orderBy }, load);

import React, { useCallback, useState } from 'react';
import {
  APIContext as APIContextType,
  FetchPolicy,
  MutationResult,
} from 'types';
import { ElectronApi } from '../../../preload/types/electron-api';

const electronApi = (window as unknown as { electron: ElectronApi }).electron
  .api;

const createUseMutationQuery =
  <Variables, Result>(
    mutateData: (arg: { variables: Variables }) => Promise<Result>,
  ) =>
  (): [
    (arg: { variables: Variables }) => Promise<MutationResult<Result>>,
    MutationResult<Result>,
  ] => {
    const [data, setData] = useState<Result>();

    const mutation = useCallback(async (arg: { variables: Variables }) => {
      const result = await mutateData(arg);
      setData(result);
      return { data: result };
    }, []);

    return [mutation, { data }];
  };

const createUseLazyQuery =
  <Variables, Result>(
    fetchData: (arg: {
      variables: Variables;
    }) => Promise<{ data: Result } | { error: Error }>,
  ) =>
  ({
    onCompleted,
    onError,
  }: {
    fetchPolicy?: FetchPolicy;
    onCompleted?(data: Result): void;
    onError?(error: Error): void;
  } = {}): [(arg: { variables: Variables }) => void, { data?: Result }] => {
    const [data, setData] = useState<Result>();

    const load = useCallback(async (arg: { variables: Variables }) => {
      const result = await fetchData(arg);
      if ('error' in result) {
        onError?.(result.error);
      } else {
        const { data } = result;
        onCompleted?.(data);
        setData(data);
      }
    }, []);

    return [load, { data }];
  };

const useCheckConnectionMutation = createUseMutationQuery(
  electronApi.CheckConnection,
);

const useGetDataTreeLazyQuery = createUseLazyQuery(
  electronApi.GetDataTreeQuery,
);

const useQueryFieldsAndRowsLazyQuery = createUseLazyQuery(
  electronApi.QueryFieldsAndRows,
);

const useQueryRowsLazyQuery = createUseLazyQuery(electronApi.QueryRows);

const contextValues = {
  useCheckConnectionMutation,
  useGetDataTreeLazyQuery,
  useQueryFieldsAndRowsLazyQuery,
  useQueryRowsLazyQuery,
};

export const APIProvider = ({
  component: Component,
}: {
  component: (props: { apiContext: APIContextType }) => JSX.Element;
}) => {
  return <Component apiContext={contextValues} />;
};

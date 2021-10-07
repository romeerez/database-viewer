import { useMutation, useQueries, useQuery, UseQueryResult } from 'react-query';
import {
  CheckConnectionMutationVariables,
  GetDataTreeQuery,
  GetDataTreeQueryVariables,
} from 'types';
import { useAPIContext } from '../lib/apiContext';
import { useLocalServers } from '../components/Server/server.service';
import { useState } from 'react';

export const useLoadServerTree = (params: GetDataTreeQueryVariables) => {
  const apiContext = useAPIContext();

  return useQuery(['serverTree', params], () =>
    apiContext.getServerTree(params),
  );
};

export const useLazyLoadServerTree = () => {
  const apiContext = useAPIContext();
  const [url, setUrl] = useState<string | undefined>();

  const query = useQuery(
    ['serverTree', { url }],
    () => apiContext.getServerTree({ url: url as string }),
    {
      enabled: url !== undefined,
    },
  );

  return [
    (url: string) => {
      setUrl(url);
    },
    query,
  ] as const;
};

export const useLoadAllServerTrees = (): GetDataTreeQuery['server'][] => {
  const apiContext = useAPIContext();
  const { data: localServers = [] } = useLocalServers();

  const queries = useQueries(
    localServers?.map(({ url }) => ({
      queryKey: ['serverTree', { url }],
      queryFn: () => apiContext.getServerTree({ url }),
    })),
  ) as UseQueryResult<GetDataTreeQuery, Error>[];

  return (
    queries
      .map((query) => query.data?.server)
      .filter((server) => server) as GetDataTreeQuery['server'][]
  ).flat();
};

export const useCheckConnection = () => {
  const apiContext = useAPIContext();

  return useMutation((params: CheckConnectionMutationVariables) =>
    apiContext.checkConnection(params),
  );
};

import {
  QueryFieldsAndRowsQuery,
  QueryFieldsAndRowsQueryVariables,
  QueryRowsQuery,
  QueryRowsQueryVariables,
} from 'types';
import { useAPIContext } from '../lib/apiContext';
import { QueryObserverOptions, useMutation } from 'react-query';

export const useFieldsAndRowsLazyQuery = (
  options: QueryObserverOptions<QueryFieldsAndRowsQuery, Error>,
) => {
  const apiContext = useAPIContext();

  const query = useMutation<
    QueryFieldsAndRowsQuery,
    Error,
    QueryFieldsAndRowsQueryVariables
  >((params) => apiContext.fieldsAndRows(params), options);

  return [
    (params: QueryFieldsAndRowsQueryVariables) => {
      query.mutate(params);
    },
    query,
  ] as const;
};

export const useRowsLazyQuery = (
  options: QueryObserverOptions<QueryRowsQuery, Error>,
) => {
  const apiContext = useAPIContext();

  const query = useMutation<QueryRowsQuery, Error, QueryRowsQueryVariables>(
    (params) => apiContext.rows(params),
    options,
  );

  return [
    (params: QueryRowsQueryVariables) => {
      query.mutate(params);
    },
    query,
  ] as const;
};

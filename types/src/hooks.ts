import {
  CheckConnectionMutation,
  GetDataTreeQuery,
  GetDataTreeQueryVariables,
  MutationCheckConnectionArgs,
  QueryFieldsAndRowsQuery,
  QueryFieldsAndRowsQueryVariables,
  QueryRowsQuery,
  QueryRowsQueryVariables,
} from './data';

type FetchPolicy = 'no-cache';

type Mutation<Variables, Result> = () => [
  (arg: { variables: Variables }) => Promise<MutationResult<Result>>,
  MutationResult<Result>,
];

type MutationResult<Result> = { data?: Result | null };

type LazyQuery<Variables, Result> = (arg: {
  fetchPolicy?: FetchPolicy;
  onCompleted?(data: Result): void;
}) => [(arg: { variables: Variables }) => void, { data?: Result }];

export type UseCheckConnectionMutation = Mutation<
  MutationCheckConnectionArgs,
  CheckConnectionMutation
>;

export type UseGetDataTreeLazyQuery = LazyQuery<
  GetDataTreeQueryVariables,
  GetDataTreeQuery
>;

export type UseQueryFieldsAndRowsLazyQuery = LazyQuery<
  QueryFieldsAndRowsQueryVariables,
  QueryFieldsAndRowsQuery
>;

export type UseQueryRowsLazyQuery = LazyQuery<
  QueryRowsQueryVariables,
  QueryRowsQuery
>;

export type APIContext = {
  useCheckConnectionMutation: UseCheckConnectionMutation;
  useGetDataTreeLazyQuery: UseGetDataTreeLazyQuery;
  useQueryFieldsAndRowsLazyQuery: UseQueryFieldsAndRowsLazyQuery;
  useQueryRowsLazyQuery: UseQueryRowsLazyQuery;
};

export type UseAPIContext = () => APIContext;

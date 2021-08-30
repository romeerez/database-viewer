import {
  CheckConnectionMutation,
  CheckConnectionMutationVariables,
  GetDataTreeQuery,
  GetDataTreeQueryVariables,
  QueryFieldsAndRowsQuery,
  QueryFieldsAndRowsQueryVariables,
  QueryRowsQuery,
  QueryRowsQueryVariables,
} from 'types';

export type Result<T> = { data: T } | { error: Error };

interface ElectronApi {
  versions: NodeJS.ProcessVersions;
  api: {
    CheckConnection: (arg: {
      variables: CheckConnectionMutationVariables;
    }) => Promise<CheckConnectionMutation>;
    GetDataTreeQuery: (arg: {
      variables: GetDataTreeQueryVariables;
    }) => Promise<Result<GetDataTreeQuery>>;
    QueryFieldsAndRows: (arg: {
      variables: QueryFieldsAndRowsQueryVariables;
    }) => Promise<Result<QueryFieldsAndRowsQuery>>;
    QueryRows: (arg: {
      variables: QueryRowsQueryVariables;
    }) => Promise<Result<QueryRowsQuery>>;
  };
}

declare interface Window {
  electron: ElectronApi;
}

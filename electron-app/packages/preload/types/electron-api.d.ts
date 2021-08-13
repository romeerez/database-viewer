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

interface ElectronApi {
  versions: NodeJS.ProcessVersions;
  api: {
    CheckConnection: (arg: {
      variables: CheckConnectionMutationVariables;
    }) => Promise<CheckConnectionMutation>;
    GetDataTreeQuery: (arg: {
      variables: GetDataTreeQueryVariables;
    }) => Promise<GetDataTreeQuery>;
    QueryFieldsAndRows: (arg: {
      variables: QueryFieldsAndRowsQueryVariables;
    }) => Promise<QueryFieldsAndRowsQuery>;
    QueryRows: (arg: {
      variables: QueryRowsQueryVariables;
    }) => Promise<QueryRowsQuery>;
  };
}

declare interface Window {
  electron: ElectronApi;
}

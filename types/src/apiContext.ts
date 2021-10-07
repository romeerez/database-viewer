import {
  CheckConnectionMutation,
  CheckConnectionMutationVariables,
  GetDataTreeQuery,
  GetDataTreeQueryVariables,
  QueryFieldsAndRowsQuery,
  QueryFieldsAndRowsQueryVariables,
  QueryRowsQuery,
  QueryRowsQueryVariables,
} from './generated';

export type ApiContext = {
  checkConnection(
    params: CheckConnectionMutationVariables,
  ): Promise<CheckConnectionMutation>;
  getServerTree(params: GetDataTreeQueryVariables): Promise<GetDataTreeQuery>;
  fieldsAndRows(
    params: QueryFieldsAndRowsQueryVariables,
  ): Promise<QueryFieldsAndRowsQuery>;
  rows(params: QueryRowsQueryVariables): Promise<QueryRowsQuery>;
};

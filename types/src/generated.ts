import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from 'react-query';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };

function fetcher<TData, TVariables>(endpoint: string, requestInit: RequestInit, query: string, variables?: TVariables) {
  return async (): Promise<TData> => {
    const res = await fetch(endpoint, {
      method: 'POST',
      ...requestInit,
      body: JSON.stringify({ query, variables }),
    });

    const json = await res.json();

    if (json.errors) {
      const { message } = json.errors[0];

      throw new Error(message);
    }

    return json.data;
  }
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Column = {
  __typename?: 'Column';
  schemaName: Scalars['String'];
  tableName: Scalars['String'];
  name: Scalars['String'];
  type: Scalars['String'];
  default?: Maybe<Scalars['String']>;
  isNullable: Scalars['Boolean'];
};

export type Constraint = {
  __typename?: 'Constraint';
  schemaName: Scalars['String'];
  tableName: Scalars['String'];
  name: Scalars['String'];
  type: ConstraintType;
  columnNames: Array<Scalars['String']>;
};

export enum ConstraintType {
  PrimaryKey = 'PrimaryKey',
  Unique = 'Unique',
  Check = 'Check',
  Exclude = 'Exclude'
}

export type Database = {
  __typename?: 'Database';
  url: Scalars['String'];
  name: Scalars['String'];
  schemas: Array<Schema>;
};

export type Field = {
  __typename?: 'Field';
  name: Scalars['String'];
  type: Scalars['String'];
};

export type ForeignKey = {
  __typename?: 'ForeignKey';
  schemaName: Scalars['String'];
  tableName: Scalars['String'];
  foreignTableSchemaName: Scalars['String'];
  foreignTableName: Scalars['String'];
  name: Scalars['String'];
  columnNames: Array<Scalars['String']>;
  foreignColumnNames: Array<Scalars['String']>;
};

export type Index = {
  __typename?: 'Index';
  schemaName: Scalars['String'];
  tableName: Scalars['String'];
  columnNames: Array<Scalars['String']>;
  name: Scalars['String'];
  isUnique: Scalars['Boolean'];
  isPrimary: Scalars['Boolean'];
};

export type Mutation = {
  __typename?: 'Mutation';
  checkConnection: Scalars['Boolean'];
};


export type MutationCheckConnectionArgs = {
  url: Scalars['String'];
};

export type Procedure = {
  __typename?: 'Procedure';
  schemaName: Scalars['String'];
  name: Scalars['String'];
  returnSet: Scalars['Boolean'];
  returnType: Scalars['String'];
  kind: Scalars['String'];
  isTrigger: Scalars['Boolean'];
  argTypes: Array<Scalars['String']>;
  argModes: Array<Scalars['String']>;
  argNames?: Maybe<Array<Scalars['String']>>;
};

export type Query = {
  __typename?: 'Query';
  server: Server;
  executeQuery: QueryResult;
};


export type QueryServerArgs = {
  url: Scalars['String'];
};


export type QueryExecuteQueryArgs = {
  url: Scalars['String'];
  query: Scalars['String'];
};

export type QueryResult = {
  __typename?: 'QueryResult';
  fields: Array<Field>;
  rows: Array<Array<Maybe<Scalars['String']>>>;
};

export type Schema = {
  __typename?: 'Schema';
  url: Scalars['String'];
  name: Scalars['String'];
  tables: Array<Table>;
  views: Array<View>;
  procedures: Array<Procedure>;
};

export type Server = {
  __typename?: 'Server';
  url: Scalars['String'];
  databases: Array<Database>;
};


export type ServerDatabasesArgs = {
  name?: Maybe<Scalars['String']>;
};

export type Table = {
  __typename?: 'Table';
  url: Scalars['String'];
  schemaName: Scalars['String'];
  name: Scalars['String'];
  columns: Array<Column>;
  indices: Array<Index>;
  foreignKeys: Array<ForeignKey>;
  constraints: Array<Constraint>;
  triggers: Array<Trigger>;
};

export type Trigger = {
  __typename?: 'Trigger';
  schemaName: Scalars['String'];
  tableName: Scalars['String'];
  triggerSchema: Scalars['String'];
  name: Scalars['String'];
  events: Array<Scalars['String']>;
  activation: Scalars['String'];
  condition?: Maybe<Scalars['String']>;
  definition: Scalars['String'];
};

export type View = {
  __typename?: 'View';
  url: Scalars['String'];
  schemaName: Scalars['String'];
  name: Scalars['String'];
  columns: Array<Column>;
};

export type CheckConnectionMutationVariables = Exact<{
  url: Scalars['String'];
}>;


export type CheckConnectionMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'checkConnection'>
);

export type GetDataTreeQueryVariables = Exact<{
  url: Scalars['String'];
}>;


export type GetDataTreeQuery = (
  { __typename?: 'Query' }
  & { server: (
    { __typename?: 'Server' }
    & Pick<Server, 'url'>
    & { databases: Array<(
      { __typename?: 'Database' }
      & Pick<Database, 'name'>
      & { schemas: Array<(
        { __typename?: 'Schema' }
        & Pick<Schema, 'name'>
        & { tables: Array<(
          { __typename?: 'Table' }
          & Pick<Table, 'name'>
          & { columns: Array<(
            { __typename?: 'Column' }
            & Pick<Column, 'name' | 'type' | 'default' | 'isNullable'>
          )>, indices: Array<(
            { __typename?: 'Index' }
            & Pick<Index, 'columnNames' | 'name' | 'isUnique' | 'isPrimary'>
          )>, foreignKeys: Array<(
            { __typename?: 'ForeignKey' }
            & Pick<ForeignKey, 'foreignTableSchemaName' | 'foreignTableName' | 'name' | 'columnNames' | 'foreignColumnNames'>
          )>, constraints: Array<(
            { __typename?: 'Constraint' }
            & Pick<Constraint, 'schemaName' | 'tableName' | 'name' | 'type' | 'columnNames'>
          )>, triggers: Array<(
            { __typename?: 'Trigger' }
            & Pick<Trigger, 'triggerSchema' | 'name' | 'events' | 'activation' | 'condition' | 'definition'>
          )> }
        )>, views: Array<(
          { __typename?: 'View' }
          & Pick<View, 'name'>
          & { columns: Array<(
            { __typename?: 'Column' }
            & Pick<Column, 'name' | 'type' | 'isNullable'>
          )> }
        )>, procedures: Array<(
          { __typename?: 'Procedure' }
          & Pick<Procedure, 'schemaName' | 'name' | 'returnSet' | 'returnType' | 'kind' | 'isTrigger' | 'argTypes' | 'argModes' | 'argNames'>
        )> }
      )> }
    )> }
  ) }
);

export type QueryFieldsAndRowsQueryVariables = Exact<{
  url: Scalars['String'];
  query: Scalars['String'];
}>;


export type QueryFieldsAndRowsQuery = (
  { __typename?: 'Query' }
  & { executeQuery: (
    { __typename?: 'QueryResult' }
    & Pick<QueryResult, 'rows'>
    & { fields: Array<(
      { __typename?: 'Field' }
      & Pick<Field, 'name' | 'type'>
    )> }
  ) }
);

export type QueryRowsQueryVariables = Exact<{
  url: Scalars['String'];
  query: Scalars['String'];
}>;


export type QueryRowsQuery = (
  { __typename?: 'Query' }
  & { executeQuery: (
    { __typename?: 'QueryResult' }
    & Pick<QueryResult, 'rows'>
  ) }
);


export const CheckConnectionDocument = `
    mutation CheckConnection($url: String!) {
  checkConnection(url: $url)
}
    `;
export const useCheckConnectionMutation = <
      TError = unknown,
      TContext = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      options?: UseMutationOptions<CheckConnectionMutation, TError, CheckConnectionMutationVariables, TContext>
    ) =>
    useMutation<CheckConnectionMutation, TError, CheckConnectionMutationVariables, TContext>(
      (variables?: CheckConnectionMutationVariables) => fetcher<CheckConnectionMutation, CheckConnectionMutationVariables>(dataSource.endpoint, dataSource.fetchParams || {}, CheckConnectionDocument, variables)(),
      options
    );
export const GetDataTreeDocument = `
    query GetDataTree($url: String!) {
  server(url: $url) {
    url
    databases {
      name
      schemas {
        name
        tables {
          name
          columns {
            name
            type
            default
            isNullable
          }
          indices {
            columnNames
            name
            isUnique
            isPrimary
          }
          foreignKeys {
            foreignTableSchemaName
            foreignTableName
            name
            columnNames
            foreignColumnNames
          }
          constraints {
            schemaName
            tableName
            name
            type
            columnNames
          }
          triggers {
            triggerSchema
            name
            events
            activation
            condition
            definition
          }
        }
        views {
          name
          columns {
            name
            type
            isNullable
          }
        }
        procedures {
          schemaName
          name
          returnSet
          returnType
          kind
          isTrigger
          argTypes
          argModes
          argNames
        }
      }
    }
  }
}
    `;
export const useGetDataTreeQuery = <
      TData = GetDataTreeQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      variables: GetDataTreeQueryVariables,
      options?: UseQueryOptions<GetDataTreeQuery, TError, TData>
    ) =>
    useQuery<GetDataTreeQuery, TError, TData>(
      ['GetDataTree', variables],
      fetcher<GetDataTreeQuery, GetDataTreeQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, GetDataTreeDocument, variables),
      options
    );
useGetDataTreeQuery.document = GetDataTreeDocument;

useGetDataTreeQuery.getKey = (variables: GetDataTreeQueryVariables) => ['GetDataTree', variables];

useGetDataTreeQuery.fetcher = (dataSource: { endpoint: string, fetchParams?: RequestInit }, variables: GetDataTreeQueryVariables) => fetcher<GetDataTreeQuery, GetDataTreeQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, GetDataTreeDocument, variables);
export const QueryFieldsAndRowsDocument = `
    query QueryFieldsAndRows($url: String!, $query: String!) {
  executeQuery(url: $url, query: $query) {
    fields {
      name
      type
    }
    rows
  }
}
    `;
export const useQueryFieldsAndRowsQuery = <
      TData = QueryFieldsAndRowsQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      variables: QueryFieldsAndRowsQueryVariables,
      options?: UseQueryOptions<QueryFieldsAndRowsQuery, TError, TData>
    ) =>
    useQuery<QueryFieldsAndRowsQuery, TError, TData>(
      ['QueryFieldsAndRows', variables],
      fetcher<QueryFieldsAndRowsQuery, QueryFieldsAndRowsQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, QueryFieldsAndRowsDocument, variables),
      options
    );
useQueryFieldsAndRowsQuery.document = QueryFieldsAndRowsDocument;

useQueryFieldsAndRowsQuery.getKey = (variables: QueryFieldsAndRowsQueryVariables) => ['QueryFieldsAndRows', variables];

useQueryFieldsAndRowsQuery.fetcher = (dataSource: { endpoint: string, fetchParams?: RequestInit }, variables: QueryFieldsAndRowsQueryVariables) => fetcher<QueryFieldsAndRowsQuery, QueryFieldsAndRowsQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, QueryFieldsAndRowsDocument, variables);
export const QueryRowsDocument = `
    query QueryRows($url: String!, $query: String!) {
  executeQuery(url: $url, query: $query) {
    rows
  }
}
    `;
export const useQueryRowsQuery = <
      TData = QueryRowsQuery,
      TError = unknown
    >(
      dataSource: { endpoint: string, fetchParams?: RequestInit },
      variables: QueryRowsQueryVariables,
      options?: UseQueryOptions<QueryRowsQuery, TError, TData>
    ) =>
    useQuery<QueryRowsQuery, TError, TData>(
      ['QueryRows', variables],
      fetcher<QueryRowsQuery, QueryRowsQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, QueryRowsDocument, variables),
      options
    );
useQueryRowsQuery.document = QueryRowsDocument;

useQueryRowsQuery.getKey = (variables: QueryRowsQueryVariables) => ['QueryRows', variables];

useQueryRowsQuery.fetcher = (dataSource: { endpoint: string, fetchParams?: RequestInit }, variables: QueryRowsQueryVariables) => fetcher<QueryRowsQuery, QueryRowsQueryVariables>(dataSource.endpoint, dataSource.fetchParams || {}, QueryRowsDocument, variables);
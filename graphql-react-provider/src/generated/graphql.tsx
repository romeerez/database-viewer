import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
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

export type DataSource = {
  __typename?: 'DataSource';
  url: Scalars['String'];
  databases: Array<Database>;
  types: Array<Type>;
};


export type DataSourceDatabasesArgs = {
  name?: Maybe<Scalars['String']>;
};

export type Database = {
  __typename?: 'Database';
  url: Scalars['String'];
  name: Scalars['String'];
  schemas: Array<Schema>;
};

export type Field = {
  __typename?: 'Field';
  name: Scalars['String'];
  type: Scalars['Int'];
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
  returnType: Scalars['Int'];
  kind: Scalars['String'];
  isTrigger: Scalars['Boolean'];
  argTypes?: Maybe<Array<Scalars['Int']>>;
  argModes?: Maybe<Array<Scalars['String']>>;
  argNames?: Maybe<Array<Scalars['String']>>;
};

export type Query = {
  __typename?: 'Query';
  dataSources: Array<DataSource>;
  executeQuery: QueryResult;
};


export type QueryDataSourcesArgs = {
  urls: Array<Scalars['String']>;
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
  types: Array<Type>;
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

export type Type = {
  __typename?: 'Type';
  schemaName: Scalars['String'];
  id: Scalars['Int'];
  name: Scalars['String'];
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
  urls: Array<Scalars['String']> | Scalars['String'];
}>;


export type GetDataTreeQuery = (
  { __typename?: 'Query' }
  & { dataSources: Array<(
    { __typename?: 'DataSource' }
    & Pick<DataSource, 'url'>
    & { types: Array<(
      { __typename?: 'Type' }
      & Pick<Type, 'id' | 'name' | 'schemaName'>
    )>, databases: Array<(
      { __typename?: 'Database' }
      & Pick<Database, 'name'>
      & { schemas: Array<(
        { __typename?: 'Schema' }
        & Pick<Schema, 'name'>
        & { types: Array<(
          { __typename?: 'Type' }
          & Pick<Type, 'id' | 'name' | 'schemaName'>
        )>, tables: Array<(
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
  )> }
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


export const CheckConnectionDocument = gql`
    mutation CheckConnection($url: String!) {
  checkConnection(url: $url)
}
    `;
export type CheckConnectionMutationFn = Apollo.MutationFunction<CheckConnectionMutation, CheckConnectionMutationVariables>;

/**
 * __useCheckConnectionMutation__
 *
 * To run a mutation, you first call `useCheckConnectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCheckConnectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [checkConnectionMutation, { data, loading, error }] = useCheckConnectionMutation({
 *   variables: {
 *      url: // value for 'url'
 *   },
 * });
 */
export function useCheckConnectionMutation(baseOptions?: Apollo.MutationHookOptions<CheckConnectionMutation, CheckConnectionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CheckConnectionMutation, CheckConnectionMutationVariables>(CheckConnectionDocument, options);
      }
export type CheckConnectionMutationHookResult = ReturnType<typeof useCheckConnectionMutation>;
export type CheckConnectionMutationResult = Apollo.MutationResult<CheckConnectionMutation>;
export type CheckConnectionMutationOptions = Apollo.BaseMutationOptions<CheckConnectionMutation, CheckConnectionMutationVariables>;
export const GetDataTreeDocument = gql`
    query GetDataTree($urls: [String!]!) {
  dataSources(urls: $urls) {
    url
    types {
      id
      name
      schemaName
    }
    databases {
      name
      schemas {
        name
        types {
          id
          name
          schemaName
        }
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

/**
 * __useGetDataTreeQuery__
 *
 * To run a query within a React component, call `useGetDataTreeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDataTreeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDataTreeQuery({
 *   variables: {
 *      urls: // value for 'urls'
 *   },
 * });
 */
export function useGetDataTreeQuery(baseOptions: Apollo.QueryHookOptions<GetDataTreeQuery, GetDataTreeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDataTreeQuery, GetDataTreeQueryVariables>(GetDataTreeDocument, options);
      }
export function useGetDataTreeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDataTreeQuery, GetDataTreeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDataTreeQuery, GetDataTreeQueryVariables>(GetDataTreeDocument, options);
        }
export type GetDataTreeQueryHookResult = ReturnType<typeof useGetDataTreeQuery>;
export type GetDataTreeLazyQueryHookResult = ReturnType<typeof useGetDataTreeLazyQuery>;
export type GetDataTreeQueryResult = Apollo.QueryResult<GetDataTreeQuery, GetDataTreeQueryVariables>;
export const QueryFieldsAndRowsDocument = gql`
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

/**
 * __useQueryFieldsAndRowsQuery__
 *
 * To run a query within a React component, call `useQueryFieldsAndRowsQuery` and pass it any options that fit your needs.
 * When your component renders, `useQueryFieldsAndRowsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useQueryFieldsAndRowsQuery({
 *   variables: {
 *      url: // value for 'url'
 *      query: // value for 'query'
 *   },
 * });
 */
export function useQueryFieldsAndRowsQuery(baseOptions: Apollo.QueryHookOptions<QueryFieldsAndRowsQuery, QueryFieldsAndRowsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<QueryFieldsAndRowsQuery, QueryFieldsAndRowsQueryVariables>(QueryFieldsAndRowsDocument, options);
      }
export function useQueryFieldsAndRowsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<QueryFieldsAndRowsQuery, QueryFieldsAndRowsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<QueryFieldsAndRowsQuery, QueryFieldsAndRowsQueryVariables>(QueryFieldsAndRowsDocument, options);
        }
export type QueryFieldsAndRowsQueryHookResult = ReturnType<typeof useQueryFieldsAndRowsQuery>;
export type QueryFieldsAndRowsLazyQueryHookResult = ReturnType<typeof useQueryFieldsAndRowsLazyQuery>;
export type QueryFieldsAndRowsQueryResult = Apollo.QueryResult<QueryFieldsAndRowsQuery, QueryFieldsAndRowsQueryVariables>;
export const QueryRowsDocument = gql`
    query QueryRows($url: String!, $query: String!) {
  executeQuery(url: $url, query: $query) {
    rows
  }
}
    `;

/**
 * __useQueryRowsQuery__
 *
 * To run a query within a React component, call `useQueryRowsQuery` and pass it any options that fit your needs.
 * When your component renders, `useQueryRowsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useQueryRowsQuery({
 *   variables: {
 *      url: // value for 'url'
 *      query: // value for 'query'
 *   },
 * });
 */
export function useQueryRowsQuery(baseOptions: Apollo.QueryHookOptions<QueryRowsQuery, QueryRowsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<QueryRowsQuery, QueryRowsQueryVariables>(QueryRowsDocument, options);
      }
export function useQueryRowsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<QueryRowsQuery, QueryRowsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<QueryRowsQuery, QueryRowsQueryVariables>(QueryRowsDocument, options);
        }
export type QueryRowsQueryHookResult = ReturnType<typeof useQueryRowsQuery>;
export type QueryRowsLazyQueryHookResult = ReturnType<typeof useQueryRowsLazyQuery>;
export type QueryRowsQueryResult = Apollo.QueryResult<QueryRowsQuery, QueryRowsQueryVariables>;
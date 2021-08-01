import * as Apollo from '@apollo/client';
export declare type Maybe<T> = T | null;
export declare type Exact<T extends {
    [key: string]: unknown;
}> = {
    [K in keyof T]: T[K];
};
export declare type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]?: Maybe<T[SubKey]>;
};
export declare type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export declare type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
};
export declare type Column = {
    __typename?: 'Column';
    schemaName: Scalars['String'];
    tableName: Scalars['String'];
    name: Scalars['String'];
    type: Scalars['String'];
    default?: Maybe<Scalars['String']>;
    isNullable: Scalars['Boolean'];
};
export declare type Constraint = {
    __typename?: 'Constraint';
    schemaName: Scalars['String'];
    tableName: Scalars['String'];
    name: Scalars['String'];
    type: ConstraintType;
    columnNames: Array<Scalars['String']>;
};
export declare enum ConstraintType {
    PrimaryKey = "PRIMARY_KEY",
    Unique = "UNIQUE",
    Check = "CHECK",
    Exclude = "EXCLUDE"
}
export declare type DataSource = {
    __typename?: 'DataSource';
    url: Scalars['String'];
    databases: Array<Database>;
    types: Array<Type>;
};
export declare type DataSourceDatabasesArgs = {
    name?: Maybe<Scalars['String']>;
};
export declare type Database = {
    __typename?: 'Database';
    url: Scalars['String'];
    name: Scalars['String'];
    schemas: Array<Schema>;
};
export declare type Field = {
    __typename?: 'Field';
    name: Scalars['String'];
    type: Scalars['Int'];
};
export declare type ForeignKey = {
    __typename?: 'ForeignKey';
    schemaName: Scalars['String'];
    tableName: Scalars['String'];
    foreignTableSchemaName: Scalars['String'];
    foreignTableName: Scalars['String'];
    name: Scalars['String'];
    columnNames: Array<Scalars['String']>;
    foreignColumnNames: Array<Scalars['String']>;
};
export declare type Index = {
    __typename?: 'Index';
    schemaName: Scalars['String'];
    tableName: Scalars['String'];
    columnNames: Array<Scalars['String']>;
    name: Scalars['String'];
    isUnique: Scalars['Boolean'];
    isPrimary: Scalars['Boolean'];
};
export declare type Mutation = {
    __typename?: 'Mutation';
    checkConnection: Scalars['Boolean'];
};
export declare type MutationCheckConnectionArgs = {
    url: Scalars['String'];
};
export declare type Query = {
    __typename?: 'Query';
    dataSources: Array<DataSource>;
    executeQuery: QueryResult;
};
export declare type QueryDataSourcesArgs = {
    urls: Array<Scalars['String']>;
};
export declare type QueryExecuteQueryArgs = {
    url: Scalars['String'];
    query: Scalars['String'];
};
export declare type QueryResult = {
    __typename?: 'QueryResult';
    fields: Array<Field>;
    rows: Array<Array<Maybe<Scalars['String']>>>;
};
export declare type Schema = {
    __typename?: 'Schema';
    url: Scalars['String'];
    name: Scalars['String'];
    tables: Array<Table>;
    types: Array<Type>;
};
export declare type Table = {
    __typename?: 'Table';
    url: Scalars['String'];
    schemaName: Scalars['String'];
    name: Scalars['String'];
    columns: Array<Column>;
    indices: Array<Index>;
    foreignKeys: Array<ForeignKey>;
    constraints: Array<Constraint>;
};
export declare type Type = {
    __typename?: 'Type';
    schemaName: Scalars['String'];
    id: Scalars['Int'];
    name: Scalars['String'];
};
export declare type CheckConnectionMutationVariables = Exact<{
    url: Scalars['String'];
}>;
export declare type CheckConnectionMutation = ({
    __typename?: 'Mutation';
} & Pick<Mutation, 'checkConnection'>);
export declare type GetDataTreeQueryVariables = Exact<{
    urls: Array<Scalars['String']> | Scalars['String'];
}>;
export declare type GetDataTreeQuery = ({
    __typename?: 'Query';
} & {
    dataSources: Array<({
        __typename?: 'DataSource';
    } & Pick<DataSource, 'url'> & {
        types: Array<({
            __typename?: 'Type';
        } & Pick<Type, 'id' | 'name' | 'schemaName'>)>;
        databases: Array<({
            __typename?: 'Database';
        } & Pick<Database, 'name'> & {
            schemas: Array<({
                __typename?: 'Schema';
            } & Pick<Schema, 'name'> & {
                types: Array<({
                    __typename?: 'Type';
                } & Pick<Type, 'id' | 'name' | 'schemaName'>)>;
                tables: Array<({
                    __typename?: 'Table';
                } & Pick<Table, 'name'> & {
                    columns: Array<({
                        __typename?: 'Column';
                    } & Pick<Column, 'name' | 'type' | 'default' | 'isNullable'>)>;
                    indices: Array<({
                        __typename?: 'Index';
                    } & Pick<Index, 'columnNames' | 'name' | 'isUnique' | 'isPrimary'>)>;
                    foreignKeys: Array<({
                        __typename?: 'ForeignKey';
                    } & Pick<ForeignKey, 'foreignTableSchemaName' | 'foreignTableName' | 'name' | 'columnNames' | 'foreignColumnNames'>)>;
                    constraints: Array<({
                        __typename?: 'Constraint';
                    } & Pick<Constraint, 'schemaName' | 'tableName' | 'name' | 'type' | 'columnNames'>)>;
                })>;
            })>;
        })>;
    })>;
});
export declare type QueryFieldsAndRowsQueryVariables = Exact<{
    url: Scalars['String'];
    query: Scalars['String'];
}>;
export declare type QueryFieldsAndRowsQuery = ({
    __typename?: 'Query';
} & {
    executeQuery: ({
        __typename?: 'QueryResult';
    } & Pick<QueryResult, 'rows'> & {
        fields: Array<({
            __typename?: 'Field';
        } & Pick<Field, 'name' | 'type'>)>;
    });
});
export declare type QueryRowsQueryVariables = Exact<{
    url: Scalars['String'];
    query: Scalars['String'];
}>;
export declare type QueryRowsQuery = ({
    __typename?: 'Query';
} & {
    executeQuery: ({
        __typename?: 'QueryResult';
    } & Pick<QueryResult, 'rows'>);
});
export declare const CheckConnectionDocument: Apollo.DocumentNode;
export declare type CheckConnectionMutationFn = Apollo.MutationFunction<CheckConnectionMutation, CheckConnectionMutationVariables>;
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
export declare function useCheckConnectionMutation(baseOptions?: Apollo.MutationHookOptions<CheckConnectionMutation, CheckConnectionMutationVariables>): Apollo.MutationTuple<CheckConnectionMutation, Exact<{
    url: string;
}>, Apollo.DefaultContext, Apollo.ApolloCache<any>>;
export declare type CheckConnectionMutationHookResult = ReturnType<typeof useCheckConnectionMutation>;
export declare type CheckConnectionMutationResult = Apollo.MutationResult<CheckConnectionMutation>;
export declare type CheckConnectionMutationOptions = Apollo.BaseMutationOptions<CheckConnectionMutation, CheckConnectionMutationVariables>;
export declare const GetDataTreeDocument: Apollo.DocumentNode;
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
export declare function useGetDataTreeQuery(baseOptions: Apollo.QueryHookOptions<GetDataTreeQuery, GetDataTreeQueryVariables>): Apollo.QueryResult<GetDataTreeQuery, Exact<{
    urls: string | string[];
}>>;
export declare function useGetDataTreeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDataTreeQuery, GetDataTreeQueryVariables>): Apollo.QueryTuple<GetDataTreeQuery, Exact<{
    urls: string | string[];
}>>;
export declare type GetDataTreeQueryHookResult = ReturnType<typeof useGetDataTreeQuery>;
export declare type GetDataTreeLazyQueryHookResult = ReturnType<typeof useGetDataTreeLazyQuery>;
export declare type GetDataTreeQueryResult = Apollo.QueryResult<GetDataTreeQuery, GetDataTreeQueryVariables>;
export declare const QueryFieldsAndRowsDocument: Apollo.DocumentNode;
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
export declare function useQueryFieldsAndRowsQuery(baseOptions: Apollo.QueryHookOptions<QueryFieldsAndRowsQuery, QueryFieldsAndRowsQueryVariables>): Apollo.QueryResult<QueryFieldsAndRowsQuery, Exact<{
    url: string;
    query: string;
}>>;
export declare function useQueryFieldsAndRowsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<QueryFieldsAndRowsQuery, QueryFieldsAndRowsQueryVariables>): Apollo.QueryTuple<QueryFieldsAndRowsQuery, Exact<{
    url: string;
    query: string;
}>>;
export declare type QueryFieldsAndRowsQueryHookResult = ReturnType<typeof useQueryFieldsAndRowsQuery>;
export declare type QueryFieldsAndRowsLazyQueryHookResult = ReturnType<typeof useQueryFieldsAndRowsLazyQuery>;
export declare type QueryFieldsAndRowsQueryResult = Apollo.QueryResult<QueryFieldsAndRowsQuery, QueryFieldsAndRowsQueryVariables>;
export declare const QueryRowsDocument: Apollo.DocumentNode;
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
export declare function useQueryRowsQuery(baseOptions: Apollo.QueryHookOptions<QueryRowsQuery, QueryRowsQueryVariables>): Apollo.QueryResult<QueryRowsQuery, Exact<{
    url: string;
    query: string;
}>>;
export declare function useQueryRowsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<QueryRowsQuery, QueryRowsQueryVariables>): Apollo.QueryTuple<QueryRowsQuery, Exact<{
    url: string;
    query: string;
}>>;
export declare type QueryRowsQueryHookResult = ReturnType<typeof useQueryRowsQuery>;
export declare type QueryRowsLazyQueryHookResult = ReturnType<typeof useQueryRowsLazyQuery>;
export declare type QueryRowsQueryResult = Apollo.QueryResult<QueryRowsQuery, QueryRowsQueryVariables>;

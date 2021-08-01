export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
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
  PrimaryKey = 'PRIMARY_KEY',
  Unique = 'UNIQUE',
  Check = 'CHECK',
  Exclude = 'EXCLUDE'
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
};

export type Type = {
  __typename?: 'Type';
  schemaName: Scalars['String'];
  id: Scalars['Int'];
  name: Scalars['String'];
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
          )> }
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

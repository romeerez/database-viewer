import type { GraphQLResolveInfo } from 'graphql';
import type { MercuriusContext } from 'mercurius';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) =>
  | Promise<import('mercurius-codegen').DeepPartial<TResult>>
  | import('mercurius-codegen').DeepPartial<TResult>;
export type RequireFields<T, K extends keyof T> = {
  [X in Exclude<keyof T, K>]?: T[X];
} &
  { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  _FieldSet: any;
};

export type Query = {
  __typename?: 'Query';
  dataSources: Array<DataSource>;
  executeQuery: QueryResult;
};

export type QuerydataSourcesArgs = {
  urls: Array<Scalars['String']>;
};

export type QueryexecuteQueryArgs = {
  url: Scalars['String'];
  query: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  checkConnection: Scalars['Boolean'];
};

export type MutationcheckConnectionArgs = {
  url: Scalars['String'];
};

export type DataSource = {
  __typename?: 'DataSource';
  url: Scalars['String'];
  databases: Array<Database>;
  types: Array<Type>;
};

export type DataSourcedatabasesArgs = {
  name?: Maybe<Scalars['String']>;
};

export type Database = {
  __typename?: 'Database';
  url: Scalars['String'];
  name: Scalars['String'];
  schemas: Array<Schema>;
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

export type Column = {
  __typename?: 'Column';
  schemaName: Scalars['String'];
  tableName: Scalars['String'];
  name: Scalars['String'];
  type: Scalars['String'];
  default?: Maybe<Scalars['String']>;
  isNullable: Scalars['Boolean'];
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

export type Constraint = {
  __typename?: 'Constraint';
  schemaName: Scalars['String'];
  tableName: Scalars['String'];
  name: Scalars['String'];
  type: ConstraintType;
  columnNames: Array<Scalars['String']>;
};

export enum ConstraintType {
  PRIMARY_KEY = 'PRIMARY_KEY',
  UNIQUE = 'UNIQUE',
  CHECK = 'CHECK',
  EXCLUDE = 'EXCLUDE',
}

export type Type = {
  __typename?: 'Type';
  schemaName: Scalars['String'];
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type QueryResult = {
  __typename?: 'QueryResult';
  fields: Array<Field>;
  rows: Array<Array<Maybe<Scalars['String']>>>;
};

export type Field = {
  __typename?: 'Field';
  name: Scalars['String'];
  type: Scalars['Int'];
};

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> =
  | LegacyStitchingResolver<TResult, TParent, TContext, TArgs>
  | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {},
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo,
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {},
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Mutation: ResolverTypeWrapper<{}>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  DataSource: ResolverTypeWrapper<DataSource>;
  Database: ResolverTypeWrapper<Database>;
  Schema: ResolverTypeWrapper<Schema>;
  Table: ResolverTypeWrapper<Table>;
  Column: ResolverTypeWrapper<Column>;
  Index: ResolverTypeWrapper<Index>;
  ForeignKey: ResolverTypeWrapper<ForeignKey>;
  Constraint: ResolverTypeWrapper<Constraint>;
  ConstraintType: ConstraintType;
  Type: ResolverTypeWrapper<Type>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  QueryResult: ResolverTypeWrapper<QueryResult>;
  Field: ResolverTypeWrapper<Field>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {};
  String: Scalars['String'];
  Mutation: {};
  Boolean: Scalars['Boolean'];
  DataSource: DataSource;
  Database: Database;
  Schema: Schema;
  Table: Table;
  Column: Column;
  Index: Index;
  ForeignKey: ForeignKey;
  Constraint: Constraint;
  Type: Type;
  Int: Scalars['Int'];
  QueryResult: QueryResult;
  Field: Field;
};

export type QueryResolvers<
  ContextType = MercuriusContext,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query'],
> = {
  dataSources?: Resolver<
    Array<ResolversTypes['DataSource']>,
    ParentType,
    ContextType,
    RequireFields<QuerydataSourcesArgs, 'urls'>
  >;
  executeQuery?: Resolver<
    ResolversTypes['QueryResult'],
    ParentType,
    ContextType,
    RequireFields<QueryexecuteQueryArgs, 'url' | 'query'>
  >;
};

export type MutationResolvers<
  ContextType = MercuriusContext,
  ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation'],
> = {
  checkConnection?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<MutationcheckConnectionArgs, 'url'>
  >;
};

export type DataSourceResolvers<
  ContextType = MercuriusContext,
  ParentType extends ResolversParentTypes['DataSource'] = ResolversParentTypes['DataSource'],
> = {
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  databases?: Resolver<
    Array<ResolversTypes['Database']>,
    ParentType,
    ContextType,
    RequireFields<DataSourcedatabasesArgs, never>
  >;
  types?: Resolver<Array<ResolversTypes['Type']>, ParentType, ContextType>;
  isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DatabaseResolvers<
  ContextType = MercuriusContext,
  ParentType extends ResolversParentTypes['Database'] = ResolversParentTypes['Database'],
> = {
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  schemas?: Resolver<Array<ResolversTypes['Schema']>, ParentType, ContextType>;
  isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SchemaResolvers<
  ContextType = MercuriusContext,
  ParentType extends ResolversParentTypes['Schema'] = ResolversParentTypes['Schema'],
> = {
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tables?: Resolver<Array<ResolversTypes['Table']>, ParentType, ContextType>;
  types?: Resolver<Array<ResolversTypes['Type']>, ParentType, ContextType>;
  isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TableResolvers<
  ContextType = MercuriusContext,
  ParentType extends ResolversParentTypes['Table'] = ResolversParentTypes['Table'],
> = {
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  schemaName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  columns?: Resolver<Array<ResolversTypes['Column']>, ParentType, ContextType>;
  indices?: Resolver<Array<ResolversTypes['Index']>, ParentType, ContextType>;
  foreignKeys?: Resolver<
    Array<ResolversTypes['ForeignKey']>,
    ParentType,
    ContextType
  >;
  constraints?: Resolver<
    Array<ResolversTypes['Constraint']>,
    ParentType,
    ContextType
  >;
  isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ColumnResolvers<
  ContextType = MercuriusContext,
  ParentType extends ResolversParentTypes['Column'] = ResolversParentTypes['Column'],
> = {
  schemaName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tableName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  default?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isNullable?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IndexResolvers<
  ContextType = MercuriusContext,
  ParentType extends ResolversParentTypes['Index'] = ResolversParentTypes['Index'],
> = {
  schemaName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tableName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  columnNames?: Resolver<
    Array<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isUnique?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isPrimary?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ForeignKeyResolvers<
  ContextType = MercuriusContext,
  ParentType extends ResolversParentTypes['ForeignKey'] = ResolversParentTypes['ForeignKey'],
> = {
  schemaName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tableName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  foreignTableSchemaName?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType
  >;
  foreignTableName?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType
  >;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  columnNames?: Resolver<
    Array<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  foreignColumnNames?: Resolver<
    Array<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ConstraintResolvers<
  ContextType = MercuriusContext,
  ParentType extends ResolversParentTypes['Constraint'] = ResolversParentTypes['Constraint'],
> = {
  schemaName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tableName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['ConstraintType'], ParentType, ContextType>;
  columnNames?: Resolver<
    Array<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TypeResolvers<
  ContextType = MercuriusContext,
  ParentType extends ResolversParentTypes['Type'] = ResolversParentTypes['Type'],
> = {
  schemaName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResultResolvers<
  ContextType = MercuriusContext,
  ParentType extends ResolversParentTypes['QueryResult'] = ResolversParentTypes['QueryResult'],
> = {
  fields?: Resolver<Array<ResolversTypes['Field']>, ParentType, ContextType>;
  rows?: Resolver<
    Array<Array<Maybe<ResolversTypes['String']>>>,
    ParentType,
    ContextType
  >;
  isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FieldResolvers<
  ContextType = MercuriusContext,
  ParentType extends ResolversParentTypes['Field'] = ResolversParentTypes['Field'],
> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = MercuriusContext> = {
  Query?: QueryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  DataSource?: DataSourceResolvers<ContextType>;
  Database?: DatabaseResolvers<ContextType>;
  Schema?: SchemaResolvers<ContextType>;
  Table?: TableResolvers<ContextType>;
  Column?: ColumnResolvers<ContextType>;
  Index?: IndexResolvers<ContextType>;
  ForeignKey?: ForeignKeyResolvers<ContextType>;
  Constraint?: ConstraintResolvers<ContextType>;
  Type?: TypeResolvers<ContextType>;
  QueryResult?: QueryResultResolvers<ContextType>;
  Field?: FieldResolvers<ContextType>;
};

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = MercuriusContext> = Resolvers<ContextType>;

type Loader<TReturn, TObj, TParams, TContext> = (
  queries: Array<{
    obj: TObj;
    params: TParams;
  }>,
  context: TContext & {
    reply: import('fastify').FastifyReply;
  },
) => Promise<Array<import('mercurius-codegen').DeepPartial<TReturn>>>;
type LoaderResolver<TReturn, TObj, TParams, TContext> =
  | Loader<TReturn, TObj, TParams, TContext>
  | {
      loader: Loader<TReturn, TObj, TParams, TContext>;
      opts?: {
        cache?: boolean;
      };
    };
export interface Loaders<
  TContext = import('mercurius').MercuriusContext & {
    reply: import('fastify').FastifyReply;
  },
> {
  DataSource?: {
    url?: LoaderResolver<Scalars['String'], DataSource, {}, TContext>;
    databases?: LoaderResolver<
      Array<Database>,
      DataSource,
      DataSourcedatabasesArgs,
      TContext
    >;
    types?: LoaderResolver<Array<Type>, DataSource, {}, TContext>;
  };

  Database?: {
    url?: LoaderResolver<Scalars['String'], Database, {}, TContext>;
    name?: LoaderResolver<Scalars['String'], Database, {}, TContext>;
    schemas?: LoaderResolver<Array<Schema>, Database, {}, TContext>;
  };

  Schema?: {
    url?: LoaderResolver<Scalars['String'], Schema, {}, TContext>;
    name?: LoaderResolver<Scalars['String'], Schema, {}, TContext>;
    tables?: LoaderResolver<Array<Table>, Schema, {}, TContext>;
    types?: LoaderResolver<Array<Type>, Schema, {}, TContext>;
  };

  Table?: {
    url?: LoaderResolver<Scalars['String'], Table, {}, TContext>;
    schemaName?: LoaderResolver<Scalars['String'], Table, {}, TContext>;
    name?: LoaderResolver<Scalars['String'], Table, {}, TContext>;
    columns?: LoaderResolver<Array<Column>, Table, {}, TContext>;
    indices?: LoaderResolver<Array<Index>, Table, {}, TContext>;
    foreignKeys?: LoaderResolver<Array<ForeignKey>, Table, {}, TContext>;
    constraints?: LoaderResolver<Array<Constraint>, Table, {}, TContext>;
  };

  Column?: {
    schemaName?: LoaderResolver<Scalars['String'], Column, {}, TContext>;
    tableName?: LoaderResolver<Scalars['String'], Column, {}, TContext>;
    name?: LoaderResolver<Scalars['String'], Column, {}, TContext>;
    type?: LoaderResolver<Scalars['String'], Column, {}, TContext>;
    default?: LoaderResolver<Maybe<Scalars['String']>, Column, {}, TContext>;
    isNullable?: LoaderResolver<Scalars['Boolean'], Column, {}, TContext>;
  };

  Index?: {
    schemaName?: LoaderResolver<Scalars['String'], Index, {}, TContext>;
    tableName?: LoaderResolver<Scalars['String'], Index, {}, TContext>;
    columnNames?: LoaderResolver<Array<Scalars['String']>, Index, {}, TContext>;
    name?: LoaderResolver<Scalars['String'], Index, {}, TContext>;
    isUnique?: LoaderResolver<Scalars['Boolean'], Index, {}, TContext>;
    isPrimary?: LoaderResolver<Scalars['Boolean'], Index, {}, TContext>;
  };

  ForeignKey?: {
    schemaName?: LoaderResolver<Scalars['String'], ForeignKey, {}, TContext>;
    tableName?: LoaderResolver<Scalars['String'], ForeignKey, {}, TContext>;
    foreignTableSchemaName?: LoaderResolver<
      Scalars['String'],
      ForeignKey,
      {},
      TContext
    >;
    foreignTableName?: LoaderResolver<
      Scalars['String'],
      ForeignKey,
      {},
      TContext
    >;
    name?: LoaderResolver<Scalars['String'], ForeignKey, {}, TContext>;
    columnNames?: LoaderResolver<
      Array<Scalars['String']>,
      ForeignKey,
      {},
      TContext
    >;
    foreignColumnNames?: LoaderResolver<
      Array<Scalars['String']>,
      ForeignKey,
      {},
      TContext
    >;
  };

  Constraint?: {
    schemaName?: LoaderResolver<Scalars['String'], Constraint, {}, TContext>;
    tableName?: LoaderResolver<Scalars['String'], Constraint, {}, TContext>;
    name?: LoaderResolver<Scalars['String'], Constraint, {}, TContext>;
    type?: LoaderResolver<ConstraintType, Constraint, {}, TContext>;
    columnNames?: LoaderResolver<
      Array<Scalars['String']>,
      Constraint,
      {},
      TContext
    >;
  };

  Type?: {
    schemaName?: LoaderResolver<Scalars['String'], Type, {}, TContext>;
    id?: LoaderResolver<Scalars['Int'], Type, {}, TContext>;
    name?: LoaderResolver<Scalars['String'], Type, {}, TContext>;
  };

  QueryResult?: {
    fields?: LoaderResolver<Array<Field>, QueryResult, {}, TContext>;
    rows?: LoaderResolver<
      Array<Maybe<Scalars['String']>>,
      QueryResult,
      {},
      TContext
    >;
  };

  Field?: {
    name?: LoaderResolver<Scalars['String'], Field, {}, TContext>;
    type?: LoaderResolver<Scalars['Int'], Field, {}, TContext>;
  };
}
declare module 'mercurius' {
  interface IResolvers
    extends Resolvers<import('mercurius').MercuriusContext> {}
  interface MercuriusLoaders extends Loaders {}
}

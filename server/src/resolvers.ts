import { IResolvers } from 'mercurius';
import { checkConnection, getConnection } from 'app/connection';
import { GraphQLEnumType } from 'graphql';
import { executeQuery } from 'app/query/query.repository';

export const resolvers: IResolvers = {
  Query: {
    dataSources: async (root, { urls }) => urls.map((url: string) => ({ url })),
    executeQuery: async (root, { url, query }, ctx) => {
      const db = await getConnection(ctx, url);
      return await executeQuery(db, query);
    },
  },
  Mutation: {
    async checkConnection(root, { url }, ctx) {
      const db = await getConnection(ctx, url);
      return await checkConnection(db);
    },
  },
  ConstraintType: new GraphQLEnumType({
    name: 'ConstraintType',
    values: {
      PRIMARY_KEY: { value: 'PRIMARY KEY' },
      UNIQUE: { value: 'UNIQUE' },
      CHECK: { value: 'CHECK' },
      EXCLUDE: { value: 'EXCLUDE' },
    },
  }) as any,
};

import { IResolvers } from 'mercurius';
import { GraphQLEnumType } from 'graphql';
import * as dataLoader from 'data-loader';

export const resolvers: IResolvers = {
  Query: {
    dataSources: async (root, params) => dataLoader.getDataSources(params),
    executeQuery: async (root, params, ctx) => {
      return await dataLoader.executeQuery(ctx.getDB, params);
    },
  },
  Mutation: {
    async checkConnection(root, params, ctx) {
      return await dataLoader.checkConnection(ctx.getDB, params);
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
  }) as never,
};

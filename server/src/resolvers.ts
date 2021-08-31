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
      PrimaryKey: { value: 'PRIMARY KEY' },
      Unique: { value: 'UNIQUE' },
      Check: { value: 'CHECK' },
      Exclude: { value: 'EXCLUDE' },
    },
  }) as never,
};

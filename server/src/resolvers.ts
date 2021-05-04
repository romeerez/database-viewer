import { IResolvers } from 'mercurius';

export const resolvers: IResolvers = {
  Query: {
    dataSources: async (root, { urls }) => urls.map((url: string) => ({ url })),
  },
};

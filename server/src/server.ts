import 'dotenv/config';
import './types';
import { port } from './config';
import mercurius from 'mercurius';
import { resolvers } from './resolvers';
import { loaders } from './loaders';
import { loadSchemaFiles } from 'mercurius-codegen';
import fastify, { FastifyRequest } from 'fastify';
import { getConnection, stopRequestConnections } from './connection';
import cors from 'fastify-cors';
import { DB } from 'data-loader';

const app = fastify({
  logger: {
    prettyPrint: true,
  },
} as any);

app.register(cors, {
  origin: true,
});

export const buildContext = ({ connectionPool }: FastifyRequest) => ({
  getDB: (url: string): Promise<DB> => getConnection(connectionPool, url),
});

const { schema } = loadSchemaFiles('src/*.gql', {
  watchOptions: {
    enabled: false,
  },
});

app.addHook('onRequest', async (request, reply) => {
  request.connectionPool = {};
});

app.addHook('onResponse', async (request, reply) => {
  await stopRequestConnections(request.connectionPool);
});

// eslint-disable-next-line
app.register(mercurius as any, {
  schema,
  resolvers,
  loaders,
  context: buildContext,
  graphiql: 'playground',
});

app.listen(port);

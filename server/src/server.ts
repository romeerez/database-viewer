import 'dotenv/config';
import './types';
import { port } from './config';
import mercurius from 'mercurius';
import { resolvers } from './resolvers';
import { loaders } from './loaders';
import { loadSchemaFiles } from 'mercurius-codegen';
import fastify, { FastifyRequest } from 'fastify';
import { stopRequestConnections } from 'app/connection';

const app = fastify({ logger: true });

export const buildContext = (req: FastifyRequest) => ({
  connectionPool: req.connectionPool,
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
  stopRequestConnections(request.connectionPool);
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

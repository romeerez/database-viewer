import { Knex } from 'knex';

// eslint-disable-next-line
export type ConnectionPool = Record<string, Knex<any, unknown>>;

declare module 'fastify' {
  export interface FastifyRequest {
    // eslint-disable-next-line
    connectionPool: ConnectionPool
  }
}

declare module 'mercurius' {
  export interface MercuriusContext {
    // eslint-disable-next-line
    connectionPool: ConnectionPool
  }
}

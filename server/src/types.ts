import { MercuriusLoaders } from 'mercurius';
import { Adapter } from 'pg-adapter';

export type DB = Adapter;

export type ConnectionPool = Record<
  string,
  { db: DB; connect?: Promise<void> }
>;

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

export type Loaders<Key extends keyof MercuriusLoaders> = Exclude<
  MercuriusLoaders[Key],
  undefined
>;

export type Await<T> = T extends {
  then(onfulfilled?: (value: infer U) => unknown): unknown;
}
  ? U
  : T;

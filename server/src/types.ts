import { MercuriusLoaders } from 'mercurius';
import { GetDB, DB } from 'data-loader';

export type ConnectionPool = Record<
  string,
  { db: DB; connect?: Promise<void> }
>;

declare module 'fastify' {
  export interface FastifyRequest {
    connectionPool: ConnectionPool;
  }
}

declare module 'mercurius' {
  export interface MercuriusContext {
    getDB: GetDB;
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

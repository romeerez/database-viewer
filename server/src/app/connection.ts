import knex, { Knex } from 'knex';
import { MercuriusContext } from 'mercurius';
import { ConnectionPool } from 'types';

const globalPool: Record<
  string,
  { connection: Knex<any, unknown[]>; counter: number }
> = {};

export const getConnection = (ctx: MercuriusContext, url: string) => {
  if (!ctx.connectionPool[url]) {
    if (globalPool[url]) {
      globalPool[url].counter++;
    } else {
      globalPool[url] = {
        connection: knex({
          client: 'pg',
          connection: url,
          log: console,
          pool: { min: 1, max: 1 },
        }),
        counter: 1,
      };
    }
    ctx.connectionPool[url] = globalPool[url].connection;
  }

  return ctx.connectionPool[url];
};

// eslint-disable-next-line
export const stopRequestConnections = (connectionPool: ConnectionPool) => {
  Object.keys(connectionPool).forEach((url) => {
    if (!connectionPool[url] || !globalPool[url]) throw new Error('No way!');

    globalPool[url].counter--;
    if (globalPool[url].counter === 0) {
      delete globalPool[url];
    }
  });
};

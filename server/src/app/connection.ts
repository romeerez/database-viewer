import { MercuriusContext } from 'mercurius';
import { ConnectionPool, DB } from 'types';
import { Client } from 'pg';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Result from 'pg/lib/result';

// eslint-disable-next-line
Result.prototype._parseRowAsArray = (row: any) => row

type Connection = { db: DB; connect?: Promise<void> };

const globalPool: Record<
  string,
  { connection: Connection; counter: number; closingPromise?: Promise<void> }
> = {};

export const getConnection = async (ctx: MercuriusContext, url: string) => {
  if (!ctx.connectionPool[url]) {
    const closingPromise = globalPool[url]?.closingPromise;
    if (closingPromise) await closingPromise;

    if (globalPool[url]) {
      globalPool[url].counter++;
    } else {
      const db = new Client({
        connectionString: url,
      });

      const connection: Connection = { db };

      const cb = () => {
        connection.connect = undefined;
      };

      connection.connect = db.connect().then(cb, cb);

      globalPool[url] = {
        connection,
        counter: 1,
      };
    }

    ctx.connectionPool[url] = globalPool[url].connection;
  }

  const connection = ctx.connectionPool[url];
  if (connection.connect) await connection.connect;
  return connection.db;
};

export const stopRequestConnections = async (
  connectionPool: ConnectionPool,
) => {
  if (!connectionPool) return;

  await Promise.all(
    Object.keys(connectionPool).map(async (url) => {
      if (!connectionPool[url] || !globalPool[url]) throw new Error('No way!');

      const { connection } = globalPool[url];
      if (connection.connect) await connection.connect;
      globalPool[url].counter--;
      if (globalPool[url].counter === 0) {
        globalPool[url].closingPromise = connection.db.end();
        await globalPool[url].closingPromise;
        delete globalPool[url];
      }
    }),
  );
};

export const checkConnection = async (db: DB) => {
  try {
    await db.query('SELECT 1');
    return true;
  } catch (_) {
    return false;
  }
};

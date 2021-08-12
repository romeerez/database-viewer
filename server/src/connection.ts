import { ConnectionPool } from './types';
import { Adapter } from 'pg-adapter';
import { DB } from 'data-loader';

type Connection = { db: DB; connect?: Promise<void> };

const globalPool: Record<
  string,
  { connection: Connection; counter: number; closingPromise?: Promise<void> }
> = {};

const jsonParser = (value: Buffer, pos: number, size: number) =>
  JSON.parse(value.slice(pos, pos + size).toString());

export const getConnection = async (
  connectionPool: ConnectionPool,
  url: string,
): Promise<DB> => {
  if (!connectionPool[url]) {
    const closingPromise = globalPool[url]?.closingPromise;
    if (closingPromise) await closingPromise;

    if (globalPool[url]) {
      globalPool[url].counter++;
    } else {
      const db = Adapter.fromURL(url);
      Object.assign(db.decodeTypes, {
        114: jsonParser, // for json
        3802: jsonParser, // for jsonb
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

    connectionPool[url] = globalPool[url].connection;
  }

  const connection = connectionPool[url];
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
        globalPool[url].closingPromise = connection.db.close();
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

import { Adapter } from 'pg-adapter';
import { DB } from 'data-loader';

const connectionPool: Record<
  string,
  {
    db: DB;
    connectingPromise?: Promise<void>;
  }
> = {};

const toInt = (value: Buffer, pos: number, size: number) =>
  parseInt(value.toString(undefined, pos, pos + size));

const trueCode = 't'.charCodeAt(0);
const toBoolean = (value: Buffer, pos: number) => value[pos] === trueCode;

const jsonParser = (value: Buffer, pos: number, size: number) =>
  JSON.parse(value.slice(pos, pos + size).toString());

export const getDB = async (url: string) => {
  let connection = connectionPool[url];
  if (!connection) {
    const db = Adapter.fromURL(url, {
      log: false,
    });

    Object.assign(db.decodeTypes, {
      20: toInt,
      21: toInt,
      23: toInt,
      26: toInt,
      16: toBoolean,
      114: jsonParser, // for json
      3802: jsonParser, // for jsonb
      1114: undefined, // don't parse timestamp
    });

    const cb = () => {
      connection.connectingPromise = undefined;
    };

    connection = {
      db,
      connectingPromise: db.connect().then(cb),
    };

    connectionPool[url] = connection;
  }

  if (connection.connectingPromise) await connection.connectingPromise;
  return connection.db;
};

export const endConnections = async () => {
  return await Promise.all(
    Object.values(connectionPool).map(async (connection) => {
      if (connection.connectingPromise) {
        await connection.connectingPromise;
      }
      await connection.db.close();
    }),
  );
};

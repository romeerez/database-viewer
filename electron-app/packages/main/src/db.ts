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

const jsonParser = (value: Buffer, pos: number, size: number) =>
  JSON.parse(value.slice(pos, pos + size).toString());

export const getDB = async (url: string) => {
  let connection = connectionPool[url];
  if (!connection) {
    const db = Adapter.fromURL(url, {
      log: false,
      decodeTypes: {
        20: toInt,
        21: toInt,
        23: toInt,
        26: toInt,
        114: jsonParser, // for json
        3802: jsonParser, // for jsonb
        // parsing a data is skipped because causes bug in table view
      },
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

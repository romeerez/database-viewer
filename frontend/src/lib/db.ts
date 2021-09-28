import { init, createStore } from './indexedDB';
import { ServerInLocalStore } from '../components/Server/types';
import { QueryInLocalStore } from '../components/Query/types';
import { KeyValue } from './keyValue.store';

enum tableNames {
  servers = 'servers',
  queries = 'queries',
  keyValue = 'keyValue',
}

const db = init('DataFigata', [
  (db) => db.createObjectStore(tableNames.servers, { autoIncrement: true }),
  (db) => db.createObjectStore(tableNames.queries, { autoIncrement: true }),
  (db) => db.createObjectStore(tableNames.keyValue, { keyPath: 'key' }),
]);

export const serversDb = createStore<ServerInLocalStore, 'id'>(
  db,
  tableNames.servers,
  'id',
);

export const queriesDb = createStore<QueryInLocalStore, 'id'>(
  db,
  tableNames.queries,
  'id',
);

// eslint-disable-next-line
export const keyValueDb = createStore<KeyValue, 'key'>(
  db,
  tableNames.keyValue,
  'key',
);

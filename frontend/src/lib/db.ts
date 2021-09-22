import { init, createStore } from './indexedDB';
import { DataSourceInLocalStore } from '../components/DataSource/types';
import { QueryInLocalStore } from '../components/Query/types';
import { KeyValue } from './keyValue.store';

enum tableNames {
  dataSources = 'dataSources',
  queries = 'queries',
  keyValue = 'keyValue',
}

const db = init('DataFigata', [
  (db) => db.createObjectStore(tableNames.dataSources, { autoIncrement: true }),
  (db) => db.createObjectStore(tableNames.queries, { autoIncrement: true }),
  (db) => db.createObjectStore(tableNames.keyValue, { keyPath: 'key' }),
]);

export const dataSourcesDb = createStore<DataSourceInLocalStore, 'id'>(
  db,
  tableNames.dataSources,
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

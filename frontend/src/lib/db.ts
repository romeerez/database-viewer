import { init, createStore } from './indexedDB';
import { DataSourceInLocalStore } from 'components/DataSource/types';
import { QueryInLocalStore } from 'components/Query/types';

enum tableNames {
  dataSources = 'dataSources',
  queries = 'queries',
}

const db = init('DataFigata', [
  (db) => db.createObjectStore(tableNames.dataSources, { autoIncrement: true }),
  (db) => db.createObjectStore(tableNames.queries, { autoIncrement: true }),
]);

export const dataSourcesDb = createStore<DataSourceInLocalStore>(
  db,
  tableNames.dataSources,
);

export const queriesDb = createStore<QueryInLocalStore>(db, tableNames.queries);

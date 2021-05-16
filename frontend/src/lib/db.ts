import { init, createStore } from './indexedDB';
import { DataSourceInLocalStore } from 'components/DataSource/types';

enum tableNames {
  dataSources = 'dataSources',
}

const db = init('DataFigata', 1, [tableNames.dataSources]);

export const dataSourcesDb = createStore<DataSourceInLocalStore>(
  db,
  tableNames.dataSources,
);

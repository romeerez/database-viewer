import { makeAutoObservable } from 'mobx';
import {
  DataSourceInLocalStore,
  DataSourceInLocalStoreWithDriver,
  Driver,
} from 'components/DataSource/types';
import { dataSourcesDb } from 'lib/db';
import { Status } from 'lib/indexedDB';

const withDriver = (
  record: DataSourceInLocalStore,
): DataSourceInLocalStoreWithDriver => {
  // eslint-disable-next-line
  const driver = record.url.match(/(.+?):/)![1] as Driver;
  return { ...record, driver };
};

export const dataSourcesStore = makeAutoObservable({
  status: 'init' as Status,
  error: undefined as Error | undefined,
  data: undefined as DataSourceInLocalStoreWithDriver[] | undefined,
  get dataSources(): DataSourceInLocalStoreWithDriver[] | undefined {
    if (this.status === 'init') this.load();
    return this.data;
  },
  async load() {
    if (this.status !== 'init') return;

    this.status = 'loading';

    try {
      const records = await dataSourcesDb.all();
      this.data = records.map(withDriver);
      this.status = 'ready';
    } catch (error) {
      this.error = error;
      this.status = 'error';
    }
  },
  async create(data: Omit<DataSourceInLocalStore, 'id'>) {
    const record = await dataSourcesDb.create(data);
    this.data?.unshift(withDriver(record));
  },
});

import { makeAutoObservable } from 'mobx';
import {
  DataSourceInLocalStore,
  DataSourceInLocalStoreWithDriver,
  Driver,
} from '../../components/DataSource/types';
import { dataSourcesDb } from '../../lib/db';
import { Status } from '../../lib/indexedDB';

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
    if (!this.data) {
      throw new Error('Data not loaded yet');
    }
    const record = await dataSourcesDb.create(data);
    this.data = [withDriver(record), ...this.data];
  },
  async update(id: number, data: Partial<DataSourceInLocalStore>) {
    const record = this.data?.find((record) => record.id === id);
    if (!this.data || !record) {
      throw new Error("Can't find record to update");
    }
    const updated = await dataSourcesDb.update(record, data);
    this.data = this.data.map((item) =>
      item.id === id ? withDriver(updated) : item,
    );
  },
  async delete(id: number) {
    if (!this.data?.some((item) => item.id === id)) {
      throw new Error("Can't find record to delete");
    }
    await dataSourcesDb.delete(id);
    this.data = this.data.filter((item) => item.id !== id);
  },
});

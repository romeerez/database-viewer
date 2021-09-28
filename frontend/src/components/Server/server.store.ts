import {
  ServerInLocalStore,
  ServerInLocalStoreWithDriver,
  Driver,
} from './types';
import { serversDb } from '../../lib/db';
import { Status } from '../../lib/indexedDB';
import { createStore } from 'jastaman';
import { useEffect } from 'react';

const withDriver = (
  record: ServerInLocalStore,
): ServerInLocalStoreWithDriver => {
  // eslint-disable-next-line
  const driver = record.url.match(/(.+?):/)![1] as Driver;
  return { ...record, driver };
};

const store = createStore({
  state: {
    status: 'init' as Status,
    error: undefined as Error | undefined,
    data: undefined as ServerInLocalStoreWithDriver[] | undefined,
  },
  useServers() {
    useEffect(() => {
      store.load();
    }, []);
    return store.use('data', 'status', 'error');
  },
  async load() {
    if (store.state.status !== 'init') return;

    store.set({ status: 'loading' });

    try {
      const records = await serversDb.all();
      store.set({ data: records.map(withDriver), status: 'ready' });
    } catch (error) {
      store.set({ error: error as Error, status: 'error' });
    }
  },
  async create(data: Omit<ServerInLocalStore, 'id'>) {
    if (!store.state.data) {
      throw new Error('Data not loaded yet');
    }
    const record = await serversDb.create(data);
    store.set({ data: [withDriver(record), ...store.state.data] });
  },
  async update(id: number, data: Partial<ServerInLocalStore>) {
    const record = store.state.data?.find((record) => record.id === id);
    if (!store.state.data || !record) {
      throw new Error("Can't find record to update");
    }
    const updated = await serversDb.update(record, data);
    store.set((state) => ({
      data: state.data?.map((item) =>
        item.id === id ? withDriver(updated) : item,
      ),
    }));
  },
  async delete(id: number) {
    if (!store.state.data?.some((item) => item.id === id)) {
      throw new Error("Can't find record to delete");
    }
    await serversDb.delete(id);
    store.set((state) => ({
      data: state.data?.filter((item) => item.id !== id),
    }));
  },
});

export const serversStore = store;

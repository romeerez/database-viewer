import { QueryInLocalStore } from './types';
import { queriesDb } from '../../lib/db';
import { Status } from '../../lib/indexedDB';
import { createStore } from 'jastaman';
import { useEffect } from 'react';

const store = createStore({
  state: {
    status: 'init' as Status,
    error: undefined as Error | undefined,
    data: undefined as QueryInLocalStore[] | undefined,
  },
  useQueries() {
    useEffect(() => {
      store.load();
    }, []);
    return store.use('data', 'status', 'error');
  },
  async load() {
    if (store.state.status !== 'init') return;

    store.set({ status: 'loading' });

    try {
      store.set({
        data: await queriesDb.all(),
        status: 'ready',
      });
    } catch (error) {
      store.set({
        error: error as Error,
        status: 'error',
      });
    }
  },
  async create(
    data: Omit<QueryInLocalStore, 'id' | 'updatedAt' | 'createdAt'>,
  ) {
    const now = new Date();
    const query: Omit<QueryInLocalStore, 'id'> = {
      ...data,
      updatedAt: now,
      createdAt: now,
    };

    const record = await queriesDb.create(query);
    store.set((state) => ({ data: [...(state.data || []), record] }));
    return record;
  },
  async update(
    { id }: QueryInLocalStore,
    { ...data }: Partial<QueryInLocalStore>,
  ) {
    const query = store.state.data?.find((query) => query.id === id);
    if (!query) {
      throw new Error(`Query is not found`);
    }

    data.updatedAt = new Date();
    const updated = await queriesDb.update(query, data);
    store.set((state) => ({
      data: state.data?.map((item) => (item.id === id ? updated : item)),
    }));
    return updated;
  },
  async delete(query: QueryInLocalStore) {
    await queriesDb.delete(query.id);
    store.set((state) => ({
      data: state.data?.filter((item) => item.id !== query.id),
    }));
  },
});

export const queriesStore = store;

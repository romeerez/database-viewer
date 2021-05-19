import { makeAutoObservable } from 'mobx';
import { QueryInLocalStore } from 'components/Query/types';
import { queriesDb } from 'lib/db';
import { Status } from 'lib/indexedDB';

export const queryStore = makeAutoObservable({
  status: 'init' as Status,
  error: undefined as Error | undefined,
  data: undefined as QueryInLocalStore[] | undefined,
  get queries(): QueryInLocalStore[] | undefined {
    if (this.status === 'init') this.load();
    return this.data;
  },
  async load() {
    if (this.status !== 'init') return;

    this.status = 'loading';

    try {
      this.data = await queriesDb.all();
      this.status = 'ready';
    } catch (error) {
      this.error = error;
      this.status = 'error';
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
    this.data = [...(this.data || []), record];
    return record;
  },
});

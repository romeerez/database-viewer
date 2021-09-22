import { createStore } from 'jastaman';
import { useEffect } from 'react';
import { keyValueDb } from './db';

// eslint-disable-next-line
export type Item<T = any> = {
  data?: T;
  loading: boolean;
  error?: Error;
};

export type KeyValue = {
  key: string;
  value: any // eslint-disable-line
};

const store = createStore({
  state: {
    data: {} as Record<KeyValue['key'], Item>,
  },
  getItem<T>(key: KeyValue['key']): Item<T> {
    return (store.state.data[key] as Item<T>) || { loading: true };
  },
  promises: {} as Record<string, Promise<unknown> | undefined>,
  useItem<T>(
    key: KeyValue['key'],
    options?: { onLoad?(value?: T): void },
  ): Item<T> {
    useEffect(() => {
      let promise = store.promises[key];
      if (!promise) {
        store.promises[key] = promise = keyValueDb.get(key);
      }

      promise
        .then((item) => {
          const { value: data } = item as { value: T };
          store.setItem(key, { data, loading: false });
          options?.onLoad?.(data);
        })
        .catch((error) => store.setItem(key, { error, loading: false }));
    }, [key]);

    return store.use(() => store.getItem(key), [key]);
  },
  setItem(key: KeyValue['key'], value: KeyValue['value']) {
    store.set((state) => ({
      data: { ...state.data, [key]: value },
    }));
  },
  removeItem(key: KeyValue['key']) {
    const data = { ...store.state.data };
    delete data[key];
    store.set({ data });
  },
  async updateValue<T extends KeyValue['value']>(
    key: KeyValue['key'],
    updater: (value?: T) => T,
  ) {
    const value = updater(store.getItem<T>(key).data);
    store.setItem(key, { data: value, loading: false });
    await keyValueDb.create({ key, value });
  },
});

export const keyValueStore = store;

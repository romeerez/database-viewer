import { KeyValue } from './types';
import { useObserver } from 'mobx-react-lite';
import store from './keyValue.store';
import { useEffect } from 'react';
import { keyValueDb } from '../../lib/db';

const subscriptions: Record<KeyValue['key'], number> = {};

export const useValue = <T>(
  key: KeyValue['key'],
  options?: { onLoad(value?: T): void },
) => {
  useEffect(() => {
    if (subscriptions[key]) {
      subscriptions[key]++;
    } else {
      subscriptions[key] = 1;

      store.setItem(key, { loading: true });

      keyValueDb
        .get(key)
        .then((item) => {
          store.setItem(key, { data: item?.value, loading: false }),
            options?.onLoad?.(item?.value);
        })
        .catch((error) => store.setItem(key, { error, loading: false }));
    }

    return () => {
      if (subscriptions[key] > 1) {
        subscriptions[key]--;
      } else {
        delete subscriptions[key];
        store.removeItem(key);
      }
    };
  }, [key]);

  return useObserver(() => store.getItem<T>(key) || { loading: true });
};

export const updateValue = async <T extends KeyValue['value']>(
  key: KeyValue['key'],
  updater: (value?: T) => T,
) => {
  const value = updater(store.getItem<T>(key).data);
  if (subscriptions[key]) {
    store.setItem(key, { data: value, loading: false });
  }

  await keyValueDb.create({ key, value });
};

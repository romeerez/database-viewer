import { KeyValue } from './types';
import { createStore } from 'jastaman';

// eslint-disable-next-line
type Item<T = any> = {
  data?: T;
  loading: boolean;
  error?: Error;
};

const store = createStore({
  state: {
    data: {} as Record<KeyValue['key'], Item>,
  },
  getItem<T>(key: KeyValue['key']) {
    return store.state.data[key] as Item<T>;
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
});

export default store;

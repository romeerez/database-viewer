import { makeAutoObservable } from 'mobx';
import { KeyValue } from './types';

// eslint-disable-next-line
type Item<T = any> = {
  data?: T;
  loading: boolean;
  error?: Error;
};

export default makeAutoObservable({
  data: {} as Record<KeyValue['key'], Item>,
  getItem<T>(key: KeyValue['key']) {
    return this.data[key] as Item<T>;
  },
  setItem(key: KeyValue['key'], value: KeyValue['value']) {
    this.data[key] = value;
  },
  removeItem(key: KeyValue['key']) {
    delete this.data[key];
  },
});

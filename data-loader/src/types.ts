import type { Adapter } from 'pg-adapter';

export type GetDB = (url: string) => Promise<DB>;

export type DB = Adapter;

export type Await<T> = T extends {
  then(onfulfilled?: (value: infer U) => unknown): unknown;
}
  ? U
  : T;

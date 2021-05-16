export type Driver = 'postgres';

export type DataSourceInLocalStore = {
  id: number;
  name: string;
  url: string;
  createdAt: Date;
};

export type DataSourceInLocalStoreWithDriver = DataSourceInLocalStore & {
  driver: Driver;
};

export type Driver = 'postgres';

export type DataSourceInLocalStore = {
  id: number;
  name: string;
  url: string;
  updatedAt: Date;
  createdAt: Date;
};

export type DataSourceInLocalStoreWithDriver = DataSourceInLocalStore & {
  driver: Driver;
};

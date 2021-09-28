export type Driver = 'postgres';

export type ServerInLocalStore = {
  id: number;
  name: string;
  url: string;
  updatedAt: Date;
  createdAt: Date;
};

export type ServerInLocalStoreWithDriver = ServerInLocalStore & {
  driver: Driver;
};

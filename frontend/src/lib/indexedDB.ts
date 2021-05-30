export type Row = Record<string, string | number | Date>;
export type DB = ReturnType<typeof init>;

export const init = (
  name: string,
  migrations: ((db: IDBDatabase) => void)[],
) => ({
  name: 'DataFigata',
  version: migrations.length,

  databasePromise: undefined as Promise<IDBDatabase> | undefined,

  getDB() {
    return (
      this.databasePromise ||
      (this.databasePromise = this.init() as Promise<IDBDatabase>)
    );
  },

  async init() {
    return new Promise<IDBDatabase>((resolve) => {
      const req = indexedDB.open(this.name, this.version);
      req.onsuccess = (e) => {
        const db = (e.target as unknown as { result: IDBDatabase }).result;
        resolve(db);
      };
      req.onupgradeneeded = ({ target, oldVersion, newVersion }) => {
        const db = (target as unknown as { result: IDBDatabase }).result;
        const to = newVersion || migrations.length;
        for (let i = oldVersion; i < to; i++) {
          migrations[i](db);
        }
      };
    });
  },

  async getObjectStore(storeName: string, mode: IDBTransactionMode) {
    const db = await this.getDB();
    const transaction = db.transaction(storeName, mode);
    return transaction.objectStore(storeName);
  },

  async createRequest(
    storeName: string,
    methodName: string,
    mode: IDBTransactionMode,
    args?: unknown[],
  ) {
    const objectStore = await this.getObjectStore(storeName, mode);
    // eslint-disable-next-line
    return (objectStore as any)[methodName].apply(objectStore, args);
  },

  async call(
    storeName: string,
    methodName: string,
    mode: IDBTransactionMode,
    args: unknown[],
  ) {
    const request = await this.createRequest(storeName, methodName, mode, args);
    return await new Promise((resolve, reject) => {
      request.onsuccess = (e: { target: { result: IDBCursorWithValue } }) =>
        resolve(e.target.result);
      request.onerror = reject;
    });
  },

  async all<T extends Row>(storeName: string) {
    const request = await this.createRequest(
      storeName,
      'openCursor',
      'readonly',
    );
    const records: T[] = [];
    await new Promise<void>((resolve, reject) => {
      request.onsuccess = (e: { target: { result: IDBCursorWithValue } }) => {
        const cursor = e.target.result;
        if (cursor) {
          records.push({ ...cursor.value, id: cursor.key });
          cursor.continue();
        } else resolve();
      };
      request.onerror = reject;
    });
    return records;
  },

  async get<T extends Row>(
    storeName: string,
    key: number | string,
  ): Promise<T> {
    return (await this.call(storeName, 'get', 'readonly', [key])) as T;
  },

  async put(storeName: string, item: unknown, key?: number | string) {
    return (await this.call(storeName, 'put', 'readwrite', [
      item,
      key,
    ])) as number;
  },

  async delete(storeName: string, key: number | string) {
    await this.call(storeName, 'delete', 'readwrite', [key]);
  },
});

export type Status = 'init' | 'loading' | 'error' | 'ready';

export interface Store<T extends Row, Id extends keyof T> {
  all(): Promise<T[]>;
  get(id: T[Id]): Promise<T>;
  create(data: Omit<T, Id> & Partial<T>): Promise<T>;
  update(record: T, data: Partial<T>): Promise<T>;
  delete(id: string | number): Promise<void>;
}

export const createStore = <T extends Row, Id extends keyof T>(
  db: DB,
  tableName: string,
  idName: Id,
): Store<T, Id> => ({
  all: () => db.all<T>(tableName),

  get: (id) => db.get<T>(tableName, id as number),

  async create(data): Promise<T> {
    const id = await db.put(tableName, data);
    return { ...data, [idName]: id } as T;
  },

  async update(record, data) {
    const updated = { ...record, ...data };
    await db.put(tableName, updated, record[idName] as number);
    return updated;
  },

  delete: (id) => db.delete(tableName, id),
});

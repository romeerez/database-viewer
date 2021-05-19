export type Row = { id: number } & Record<string, string | number | Date>;
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
    args?: any[],
  ) {
    const objectStore = await this.getObjectStore(storeName, mode);
    return (objectStore as any)[methodName].apply(objectStore, args);
  },

  async call(
    storeName: string,
    methodName: string,
    mode: IDBTransactionMode,
    args: any[],
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

  async get<T extends Row>(storeName: string, key: number) {
    return (await this.call(storeName, 'get', 'readonly', [key])) as Row;
  },

  async put(storeName: string, item: any, key?: number) {
    return (await this.call(storeName, 'put', 'readwrite', [
      item,
      key,
    ])) as number;
  },

  async delete(storeName: string, key: number) {
    return await this.call(storeName, 'delete', 'readwrite', [key]);
  },
});

export type Status = 'init' | 'loading' | 'error' | 'ready';

export const createStore = <T extends Row>(db: DB, tableName: string) => ({
  all: () => db.all<T>(tableName),

  get: (id: number) => db.get<T>(tableName, id),

  async create(data: Omit<T, 'id'>): Promise<T> {
    const id = await db.put(tableName, data);
    return { ...data, id } as T;
  },

  async update(record: T, data: Partial<T>) {
    const updated = { ...record, ...data };
    await db.put(tableName, updated, record.id);
    return updated;
  },

  delete: (id: number) => db.delete(tableName, id),
});

import {
  Server,
  MutationCheckConnectionArgs,
  QueryServersArgs,
  QueryExecuteQueryArgs,
  QueryResult,
  Type,
} from 'types';
import { GetDB, DB, Await } from './types';
import * as repo from './repository';

export type { GetDB, DB };

export const getServers = ({
  urls,
}: QueryServersArgs): { url: Server['url'] }[] => {
  return urls.map((url) => ({ url }));
};

export const executeQuery = async (
  getDB: GetDB,
  { url, query }: QueryExecuteQueryArgs,
): Promise<QueryResult> => {
  const db = await getDB(url);
  return repo.executeQuery(db, query);
};

export const checkConnection = async (
  getDB: GetDB,
  { url }: MutationCheckConnectionArgs,
): Promise<boolean> => {
  const db = await getDB(url);
  return await repo.checkConnection(db);
};

export const getDatabases = async (getDB: GetDB, urls: string[]) => {
  return await Promise.all(
    urls.map(async (url) => {
      const db = await getDB(url);
      return await repo.getDatabases(db, url);
    }),
  );
};

export const getSystemDataTypes = async (getDB: GetDB, urls: string[]) => {
  return await Promise.all(
    urls.map(async (url) => {
      const db = await getDB(url);
      return await repo.getSystemDataTypes(db);
    }),
  );
};

export const getSchemas = async (getDB: GetDB, urls: string[]) => {
  return await Promise.all(
    urls.map(async (url) => {
      const db = await getDB(url);
      return await repo.getSchemas(db, url);
    }),
  );
};

export const getTables = async (
  getDB: GetDB,
  schemas: { url: string; name: string }[],
) => {
  if (schemas.length === 0) return [];

  const urls = schemas.map((obj) => obj.url);
  const uniqueUrls = Array.from(new Set(urls));

  const grouped: Record<string, Await<ReturnType<typeof repo.getTables>>> = {};

  await Promise.all(
    uniqueUrls.map(async (url) => {
      const schemaNames = schemas
        .filter((obj) => obj.url === url)
        .map((obj) => obj.name);

      const db = await getDB(url);
      grouped[url] = await repo.getTables(db, schemaNames, url);
    }),
  );

  return schemas.map((schema) =>
    grouped[schema.url].filter((table) => table.schemaName === schema.name),
  );
};

export const getViews = async (
  getDB: GetDB,
  schemas: { url: string; name: string }[],
) => {
  if (schemas.length === 0) return [];

  const urls = schemas.map((obj) => obj.url);
  const uniqueUrls = Array.from(new Set(urls));

  const grouped: Record<string, Await<ReturnType<typeof repo.getViews>>> = {};

  await Promise.all(
    uniqueUrls.map(async (url) => {
      const schemaNames = schemas
        .filter((obj) => obj.url === url)
        .map((obj) => obj.name);

      const db = await getDB(url);
      grouped[url] = await repo.getViews(db, schemaNames, url);
    }),
  );

  return schemas.map((schema) =>
    grouped[schema.url].filter((item) => item.schemaName === schema.name),
  );
};

export const getProcedures = async (
  getDB: GetDB,
  schemas: { url: string; name: string }[],
) => {
  if (schemas.length === 0) return [];

  const urls = schemas.map((obj) => obj.url);
  const uniqueUrls = Array.from(new Set(urls));

  const grouped: Record<
    string,
    Await<ReturnType<typeof repo.getProcedures>>
  > = {};

  await Promise.all(
    uniqueUrls.map(async (url) => {
      const schemaNames = schemas
        .filter((obj) => obj.url === url)
        .map((obj) => obj.name);

      const db = await getDB(url);
      grouped[url] = await repo.getProcedures(db, schemaNames);
    }),
  );

  return schemas.map((schema) =>
    grouped[schema.url].filter((item) => item.schemaName === schema.name),
  );
};

export const getSchemaDataTypes = async (
  getDB: GetDB,
  schemas: { url: string; name: string }[],
) => {
  if (schemas.length === 0) return [];

  const map = new Map<string, { schemaNames: Set<string>; types: Type[] }>();

  schemas.forEach((obj) => {
    let data = map.get(obj.url);
    if (!data) {
      data = { schemaNames: new Set(), types: [] };
      map.set(obj.url, data);
    }
    data.schemaNames.add(obj.name);
  });

  await Promise.all(
    Array.from(map.keys()).map(async (url) => {
      const db = await getDB(url);
      const data = map.get(url);
      if (!data) return;

      data.types = await repo.getSchemaDataTypes(
        db,
        Array.from(data.schemaNames),
      );
    }),
  );

  return schemas.map(
    ({ url, name }) =>
      map.get(url)?.types.filter((type) => type.schemaName === name) || [],
  );
};

const loadTableItems =
  <T extends { schemaName: string; tableName: string }>(
    getItems: (
      db: DB,
      schemaNames: string[],
      tableNames: string[],
    ) => Promise<T[]>,
  ) =>
  async (
    getDB: GetDB,
    tables: { url: string; name: string; schemaName: string }[],
  ) => {
    if (tables.length === 0) return [];

    const map = new Map<
      string,
      {
        schemas: Set<string>;
        tables: Set<string>;
        items: T[];
      }
    >();

    tables.forEach((obj) => {
      let data = map.get(obj.url);
      if (!data) {
        data = {
          schemas: new Set(),
          tables: new Set(),
          items: [],
        };
        map.set(obj.url, data);
      }
      data.schemas.add(obj.schemaName);
      data.tables.add(obj.name);
    });

    await Promise.all(
      Array.from(map.keys()).map(async (url) => {
        const db = await getDB(url);
        const data = map.get(url);
        if (!data) return;

        data.items = await getItems(
          db,
          Array.from(data.schemas),
          Array.from(data.tables),
        );
      }),
    );

    return tables.map(
      ({ url, schemaName, name: tableName }) =>
        map
          .get(url)
          ?.items.filter(
            (column) =>
              column.schemaName === schemaName &&
              column.tableName === tableName,
          ) || [],
    );
  };

export const getColumns = loadTableItems(repo.getColumns);
export const getIndices = loadTableItems(repo.getIndices);
export const getForeignKeys = loadTableItems(repo.getForeignKeys);
export const getConstraints = loadTableItems(repo.getConstraints);
export const getTriggers = loadTableItems(repo.getTriggers);

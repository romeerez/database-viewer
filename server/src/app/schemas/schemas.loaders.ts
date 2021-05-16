import { Await, Loaders } from 'types';
import { getConnection } from 'app/connection';
import { getTables } from 'app/tables/tables.repository';
import { getSchemaDataTypes } from 'app/dataTypes/dataTypes.repository';
import { Type } from 'graphql/generated';

export const schemasLoaders: Loaders<'Schema'> = {
  async tables(schemas, ctx) {
    if (schemas.length === 0) return [];

    const urls = schemas.map(({ obj }) => obj.url);
    const uniqueUrls = [...new Set(urls)];

    const groupedTables: Record<string, Await<ReturnType<typeof getTables>>> =
      {};

    await Promise.all(
      uniqueUrls.map(async (url) => {
        const schemaNames = schemas
          .filter(({ obj }) => obj.url === url)
          .map(({ obj }) => obj.name);

        const db = await getConnection(ctx, url);
        groupedTables[url] = await getTables(db, schemaNames, url);
      }),
    );

    return schemas.map(({ obj }) =>
      groupedTables[obj.url].filter((table) => table.schemaName === obj.name),
    );
  },

  async types(schemas, ctx) {
    if (schemas.length === 0) return [];

    const map = new Map<string, { schemaNames: Set<string>; types: Type[] }>();

    schemas.forEach(({ obj }) => {
      let data = map.get(obj.url);
      if (!data) {
        data = { schemaNames: new Set(), types: [] };
        map.set(obj.url, data);
      }
      data.schemaNames.add(obj.name);
    });

    await Promise.all(
      [...map.keys()].map(async (url) => {
        const db = await getConnection(ctx, url);
        const data = map.get(url);
        if (!data) return;

        data.types = await getSchemaDataTypes(db, [...data.schemaNames]);
      }),
    );

    return schemas.map(
      ({ obj: { url, name } }) =>
        map.get(url)?.types.filter((type) => type.schemaName === name) || [],
    );
  },
};

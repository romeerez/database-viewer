import { DB } from 'types';
import { Loaders } from 'types';
import { getConnection } from 'app/connection';
import { Table } from 'graphql/generated';
import { MercuriusContext } from 'mercurius';
import { getColumns } from 'app/columns/columns.repository';
import { getIndices } from 'app/indices/indices.repository';
import { getForeignKeys } from 'app/foreignKeys/foreignKeys.repository';
import { getConstraints } from 'app/constraints/constraints.repository';

const loadTableItems =
  <T extends { schemaName: string; tableName: string }>(
    getItems: (
      db: DB,
      schemaNames: string[],
      tableNames: string[],
    ) => Promise<T[]>,
  ) =>
  async (tables: { obj: Table }[], ctx: MercuriusContext) => {
    if (tables.length === 0) return [];

    const map = new Map<
      string,
      {
        schemas: Set<string>;
        tables: Set<string>;
        items: T[];
      }
    >();

    tables.forEach(({ obj }) => {
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
      [...map.keys()].map(async (url) => {
        const db = await getConnection(ctx, url);
        const data = map.get(url);
        if (!data) return;

        data.items = await getItems(db, [...data.schemas], [...data.tables]);
      }),
    );

    return tables.map(
      ({ obj: { url, schemaName, name: tableName } }) =>
        map
          .get(url)
          ?.items.filter(
            (column) =>
              column.schemaName === schemaName &&
              column.tableName === tableName,
          ) || [],
    );
  };

export const tablesLoaders: Loaders<'Table'> = {
  columns: loadTableItems(getColumns),
  indices: loadTableItems(getIndices),
  foreignKeys: loadTableItems(getForeignKeys),
  constraints: loadTableItems(getConstraints),
};

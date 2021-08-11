import { Table } from 'graphql/generated';
import { DB } from 'types';
import { quote } from 'pg-adapter';

export const getTables = async (
  db: DB,
  schemaNames: string[],
  url: string,
): Promise<Pick<Table, 'url' | 'schemaName' | 'name'>[]> => {
  const rows = await db.query<{ schemaName: string; name: string }[]>(
    `
    SELECT
      table_schema "schemaName",
      table_name "name"
    FROM information_schema.tables
    WHERE table_schema IN (${schemaNames.map(quote).join(', ')})
  `,
  );

  return rows.map((table) => ({ ...table, url }));
};

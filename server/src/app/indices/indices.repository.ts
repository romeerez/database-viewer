import { Index } from 'graphql/generated';
import { DB } from 'types';
import { quote } from 'pg-adapter';

export const getIndices = async (
  db: DB,
  schemaNames: string[],
  tableNames: string[],
): Promise<Index[]> => {
  return await db.query<Index[]>(
    `
    SELECT
      nspname "schemaName",
      t.relname "tableName",
      json_agg(attname) "columnNames",
      ic.relname "name",
      indisunique "isUnique",
      indisprimary "isPrimary"
    FROM pg_index
    JOIN pg_class t ON t.oid = indrelid
    JOIN pg_namespace n ON n.oid = t.relnamespace
    JOIN pg_attribute ON attrelid = t.oid AND attnum = any(indkey)
    JOIN pg_class ic ON ic.oid = indexrelid
    WHERE n.nspname IN (${schemaNames.map(quote).join(', ')})
      AND t.relname IN (${tableNames.map(quote).join(', ')})
    GROUP BY "schemaName", "tableName", "name", "isUnique", "isPrimary"
  `,
  );
};

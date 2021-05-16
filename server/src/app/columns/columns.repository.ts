import { DB } from 'types';
import { Column } from 'graphql/generated';
import { quote } from 'pg-adapter';

export const getColumns = async (
  db: DB,
  schemaNames: string[],
  tableNames: string[],
): Promise<Column[]> => {
  const { rows } = await db.query<Column>(
    `
        SELECT table_schema         "schemaName",
               table_name           "tableName",
               column_name          "name",
               data_type            "type",
               column_default       "default",
               is_nullable::boolean "isNullable"
        FROM information_schema.columns
        WHERE table_schema IN (${schemaNames.map(quote).join(', ')})
          AND table_name IN (${tableNames.map(quote).join(', ')})
    `,
  );

  return rows;
};

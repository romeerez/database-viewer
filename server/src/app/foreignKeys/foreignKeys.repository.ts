import { ForeignKey } from 'graphql/generated';
import { DB } from 'types';
import { quote } from 'pg-adapter';

export const getForeignKeys = async (
  db: DB,
  schemaNames: string[],
  tableNames: string[],
): Promise<ForeignKey[]> => {
  return await db.query<ForeignKey[]>(
    `
        SELECT tc.table_schema           as "schemaName",
               tc.table_name             as "tableName",
               ccu.table_schema          as "foreignTableSchemaName",
               ccu.table_name            as "foreignTableName",
               tc.constraint_name        as "name",
               (
                   SELECT json_agg(kcu.column_name)
                   FROM information_schema.key_column_usage kcu
                   WHERE kcu.constraint_name = tc.constraint_name
                     AND kcu.table_schema = tc.table_schema
               )                         as "columnNames",
               json_agg(ccu.column_name) as "foreignColumnNames"
        FROM information_schema.table_constraints tc
                 JOIN information_schema.constraint_column_usage ccu
                      ON ccu.constraint_name = tc.constraint_name
                          AND ccu.table_schema = tc.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY'
          AND tc.table_schema IN (${schemaNames.map(quote).join(', ')})
          AND tc.table_name IN (${tableNames.map(quote).join(', ')})
        GROUP BY "schemaName", "tableName", "name", "foreignTableSchemaName", "foreignTableName"
    `,
  );
};

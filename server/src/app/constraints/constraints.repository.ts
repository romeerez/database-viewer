import { Constraint } from 'graphql/generated';
import { DB } from 'types';
import { quote } from 'pg-adapter';

export const getConstraints = async (
  db: DB,
  schemaNames: string[],
  tableNames: string[],
): Promise<Constraint[]> => {
  const { rows } = await db.query<Constraint>(
    `
        SELECT tc.table_schema    as     "schemaName",
               tc.table_name      as     "tableName",
               tc.constraint_name as     "name",
               tc.constraint_type as     "type",
               json_agg(ccu.column_name) "columnNames"
        FROM information_schema.table_constraints tc
                 JOIN information_schema.constraint_column_usage ccu
                      ON ccu.constraint_name = tc.constraint_name
                          AND ccu.table_schema = tc.table_schema
        WHERE tc.constraint_type != 'FOREIGN KEY'
          AND tc.table_schema IN (${schemaNames.map(quote).join(', ')})
          AND tc.table_name IN (${tableNames.map(quote).join(', ')})
        GROUP BY "schemaName", "tableName", "name", "type"
    `,
  );

  return rows;
};

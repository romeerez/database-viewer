import { Type } from 'graphql/generated';
import { DB } from 'types';
import { quote } from 'pg-adapter';

export const getSystemDataTypes = async (db: DB): Promise<Type[]> => {
  return await db.query<Type[]>(
    `
        SELECT t.oid "id", typname "name", nspname "schemaName"
        FROM pg_type t
        JOIN pg_catalog.pg_namespace n on n.oid = typnamespace
        WHERE nspname IN ('pg_catalog', 'pg_toast', 'information_schema')
    `,
  );
};

export const getSchemaDataTypes = async (
  db: DB,
  schemaNames: string[],
): Promise<Type[]> => {
  return await db.query<Type[]>(
    `
        SELECT t.oid "id", typname "name", nspname "schemaName"
        FROM pg_type t
        JOIN pg_catalog.pg_namespace n on n.oid = typnamespace
        WHERE nspname IN (${schemaNames.map(quote).join(', ')})
    `,
  );
};

import { DB } from './types';
import { URL } from 'url';
import {
  QueryResult,
  Type,
  Schema,
  Table,
  Column,
  Constraint,
  ForeignKey,
  Index,
} from 'types';
import { quote } from 'pg-adapter';

export const executeQuery = async (
  db: DB,
  query: string,
): Promise<QueryResult> => {
  try {
    const { fields, result = [] } = await db.arraysWithFields<
      QueryResult['rows']
    >(query);

    return {
      fields: fields.map((field) => ({
        name: field.name,
        type: field.dataTypeID,
      })),
      rows: result,
    };
  } catch (error) {
    try {
      await db.exec('ROLLBACK');
    } catch (_) {
      // ignore
    }

    throw error;
  }
};

export const checkConnection = async (db: DB) => {
  try {
    await db.value('SELECT 1');
    return true;
  } catch (_) {
    return false;
  }
};

export const getDatabases = async (db: DB, url: string) => {
  const sourceUrl = new URL(url);

  if (sourceUrl.pathname) {
    return [
      {
        url,
        name: sourceUrl.pathname.slice(1),
      },
    ];
  }

  const rows = await db.query<{ name: string }[]>(
    'SELECT datname as name FROM pg_database WHERE NOT datistemplate',
  );

  return rows.map((row) => {
    sourceUrl.pathname = row.name;

    return {
      url: sourceUrl.toString(),
      name: row.name,
    };
  });
};

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

export const getSchemas = async (
  db: DB,
  url: string,
): Promise<Pick<Schema, 'url' | 'name'>[]> => {
  const rows = await db.query<{ name: string }[]>(`
    SELECT n.nspname "name"
    FROM pg_catalog.pg_namespace n
    WHERE n.nspname !~ '^pg_' AND n.nspname != 'information_schema'
    ORDER BY "name"
  `);

  return rows.map((row) => ({
    url,
    name: row.name,
  }));
};

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

export const getColumns = async (
  db: DB,
  schemaNames: string[],
  tableNames: string[],
): Promise<Column[]> => {
  return await db.query<Column[]>(
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
};

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

export const getConstraints = async (
  db: DB,
  schemaNames: string[],
  tableNames: string[],
): Promise<Constraint[]> => {
  return await db.query<Constraint[]>(
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
};

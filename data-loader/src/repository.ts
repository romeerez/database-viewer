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
  Trigger,
  Procedure,
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
    'SELECT datname AS name FROM pg_database WHERE NOT datistemplate ORDER BY datname',
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
  return await db.query<Type[]>(`
    SELECT t.oid "id", typname "name", nspname "schemaName"
    FROM pg_type t
    JOIN pg_catalog.pg_namespace n on n.oid = typnamespace
    WHERE nspname IN ('pg_catalog', 'pg_toast', 'information_schema')
  `);
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
  const rows = await db.query<{ schemaName: string; name: string }[]>(`
    SELECT
      table_schema "schemaName",
      table_name "name"
    FROM information_schema.tables
    WHERE table_schema IN (${schemaNames.map(quote).join(', ')})
      AND table_type = 'BASE TABLE'
    ORDER BY table_name
  `);

  return rows.map((table) => ({ ...table, url }));
};

export const getViews = async (
  db: DB,
  schemaNames: string[],
  url: string,
): Promise<Pick<Table, 'url' | 'schemaName' | 'name'>[]> => {
  const rows = await db.query<{ schemaName: string; name: string }[]>(`
    SELECT
      table_schema "schemaName",
      table_name "name"
    FROM information_schema.tables
    WHERE table_schema IN (${schemaNames.map(quote).join(', ')})
      AND table_type = 'VIEW'
    ORDER BY table_name
  `);

  return rows.map((table) => ({ ...table, url }));
};

export const getProcedures = async (db: DB, schemaNames: string[]) => {
  return await db.query<Procedure[]>(`
    SELECT
      n.nspname AS "schemaName",
      proname AS name,
      proretset AS "returnSet",
      prorettype AS "returnType",
      prokind AS "kind",
      coalesce((
        SELECT true FROM information_schema.triggers
        WHERE n.nspname = trigger_schema AND trigger_name = proname
        LIMIT 1
      ), false) AS "isTrigger",
      coalesce(to_json(proallargtypes::int[]), to_json(proargtypes::int[])) AS "argTypes",
      to_json(proargmodes) AS "argModes",
      to_json(proargnames) AS "argNames"
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname IN (${schemaNames.map(quote).join(', ')})
  `);
};

export const getSchemaDataTypes = async (
  db: DB,
  schemaNames: string[],
): Promise<Type[]> => {
  return await db.query<Type[]>(`
    SELECT t.oid "id", typname "name", nspname "schemaName"
    FROM pg_type t
    JOIN pg_catalog.pg_namespace n on n.oid = typnamespace
    WHERE nspname IN (${schemaNames.map(quote).join(', ')})
  `);
};

export const getColumns = async (
  db: DB,
  schemaNames: string[],
  tableNames: string[],
): Promise<Column[]> => {
  return await db.query<Column[]>(`
    SELECT table_schema         "schemaName",
           table_name           "tableName",
           column_name          "name",
           data_type            "type",
           column_default       "default",
           is_nullable::boolean "isNullable"
    FROM information_schema.columns
    WHERE table_schema IN (${schemaNames.map(quote).join(', ')})
      AND table_name IN (${tableNames.map(quote).join(', ')})
    ORDER BY ordinal_position
  `);
};

export const getIndices = async (
  db: DB,
  schemaNames: string[],
  tableNames: string[],
): Promise<Index[]> => {
  return await db.query<Index[]>(`
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
    ORDER BY "name"
  `);
};

export const getForeignKeys = async (
  db: DB,
  schemaNames: string[],
  tableNames: string[],
): Promise<ForeignKey[]> => {
  return await db.query<ForeignKey[]>(`
    SELECT tc.table_schema           AS "schemaName",
           tc.table_name             AS "tableName",
           ccu.table_schema          AS "foreignTableSchemaName",
           ccu.table_name            AS "foreignTableName",
           tc.constraint_name        AS "name",
           (
               SELECT json_agg(kcu.column_name)
               FROM information_schema.key_column_usage kcu
               WHERE kcu.constraint_name = tc.constraint_name
                 AND kcu.table_schema = tc.table_schema
           )                         AS "columnNames",
           json_agg(ccu.column_name) AS "foreignColumnNames"
    FROM information_schema.table_constraints tc
             JOIN information_schema.constraint_column_usage ccu
                  ON ccu.constraint_name = tc.constraint_name
                      AND ccu.table_schema = tc.table_schema
    WHERE tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_schema IN (${schemaNames.map(quote).join(', ')})
      AND tc.table_name IN (${tableNames.map(quote).join(', ')})
    GROUP BY "schemaName", "tableName", "name", "foreignTableSchemaName", "foreignTableName"
    ORDER BY "name"
  `);
};

export const getConstraints = async (
  db: DB,
  schemaNames: string[],
  tableNames: string[],
): Promise<Constraint[]> => {
  return await db.query<Constraint[]>(`
        SELECT tc.table_schema    AS     "schemaName",
               tc.table_name      AS     "tableName",
               tc.constraint_name AS     "name",
               tc.constraint_type AS     "type",
               json_agg(ccu.column_name) "columnNames"
        FROM information_schema.table_constraints tc
                 JOIN information_schema.constraint_column_usage ccu
                      ON ccu.constraint_name = tc.constraint_name
                          AND ccu.table_schema = tc.table_schema
        WHERE tc.constraint_type != 'FOREIGN KEY'
          AND tc.table_schema IN (${schemaNames.map(quote).join(', ')})
          AND tc.table_name IN (${tableNames.map(quote).join(', ')})
        GROUP BY "schemaName", "tableName", "name", "type"
        ORDER BY "name"
    `);
};

export const getTriggers = async (
  db: DB,
  schemaNames: string[],
  tableNames: string[],
): Promise<Trigger[]> => {
  return await db.query<Trigger[]>(`
    SELECT event_object_schema AS "schemaName",
           event_object_table AS "tableName",
           trigger_schema AS "triggerSchema",
           trigger_name AS name,
           json_agg(event_manipulation) AS events,
           action_timing AS activation,
           action_condition AS condition,
           action_statement AS definition
    FROM information_schema.triggers
    WHERE event_object_schema IN (${schemaNames.map(quote).join(', ')})
      AND event_object_table IN (${tableNames.map(quote).join(', ')})
    GROUP BY event_object_schema, event_object_table, trigger_schema, trigger_name, action_timing, action_condition, action_statement
    ORDER BY trigger_name
  `);
};

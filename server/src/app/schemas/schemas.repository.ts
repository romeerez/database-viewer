import { Schema } from 'graphql/generated';
import { DB } from 'types';

export const getSchemas = async (
  db: DB,
  url: string,
): Promise<Pick<Schema, 'url' | 'name'>[]> => {
  const { rows } = await db.query<{ name: string }>(`
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

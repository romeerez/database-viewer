import { Knex } from 'knex';

export const getSchemas = async (
  knex: Knex<any, unknown[]>,
  url: string,
): Promise<{ name: string }[]> => {
  const { rows } = await knex.raw<{ rows: { name: string }[] }>(
    'SELECT n.nspname "name" ' +
      'FROM pg_catalog.pg_namespace n ' +
      "WHERE n.nspname !~ '^pg_' AND n.nspname <> 'information_schema' " +
      'ORDER BY "name"',
  );
  return rows.map((row) => ({
    url,
    name: row.name,
  }));
};

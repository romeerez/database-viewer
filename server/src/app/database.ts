import { Knex } from 'knex';
import { URL } from 'url';

export const getDatabases = async (
  knex: Knex<any, unknown[]>,
  dataSourceUrl: string,
): Promise<{ url: string; name: string }[]> => {
  const { rows } = await knex.raw<{ rows: { name: string }[] }>(
    'SELECT datname as name FROM pg_database WHERE NOT datistemplate',
  );
  return rows.map((row) => {
    const sourceUrl = new URL(dataSourceUrl);
    sourceUrl.pathname = row.name;

    return {
      url: sourceUrl.toString(),
      name: row.name,
    };
  });
};

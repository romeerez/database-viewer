import { Knex } from 'knex';

export const getTables = async (
  knex: Knex<any, unknown[]>,
  schemaNames: string[],
  url: string,
) => {
  const tables = <{ schemaName: string; name: string }[]>(
    await knex
      .select(knex.raw('table_schema "schemaName", table_name "name"'))
      .from('information_schema.tables')
      .whereIn('table_schema', schemaNames)
  );

  return tables.map((table) => ({ ...table, url }));
};

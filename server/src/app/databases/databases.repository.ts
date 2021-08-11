import { URL } from 'url';
import { Database } from 'graphql/generated';
import { DB } from 'types';

export const getDatabases = async (
  db: DB,
  dataSourceUrl: string,
): Promise<Pick<Database, 'url' | 'name'>[]> => {
  const sourceUrl = new URL(dataSourceUrl);

  if (sourceUrl.pathname) {
    return [
      {
        url: dataSourceUrl,
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

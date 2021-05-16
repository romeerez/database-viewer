import { Loaders } from 'types';
import { getConnection } from 'app/connection';
import { getDatabases } from 'app/databases/databases.repository';
import { getSystemDataTypes } from 'app/dataTypes/dataTypes.repository';

export const dataSourcesLoaders: Loaders<'DataSource'> = {
  async databases(dataSources, ctx) {
    return await Promise.all(
      dataSources.map(async ({ obj }) => {
        const db = await getConnection(ctx, obj.url);
        return await getDatabases(db, obj.url);
      }),
    );
  },
  async types(dataSources, ctx) {
    return await Promise.all(
      dataSources.map(async ({ obj }) => {
        const db = await getConnection(ctx, obj.url);
        return await getSystemDataTypes(db);
      }),
    );
  },
};

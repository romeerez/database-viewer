import { Loaders } from 'types';
import { getConnection } from 'app/connection';
import { getSchemas } from 'app/schemas/schemas.repository';

export const databasesLoaders: Loaders<'Database'> = {
  async schemas(databases, ctx) {
    return await Promise.all(
      databases.map(async ({ obj }) => {
        const db = await getConnection(ctx, obj.url);
        return await getSchemas(db, obj.url);
      }),
    );
  },
};

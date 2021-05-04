import { MercuriusLoaders } from 'mercurius';
import * as connectionService from 'app/connection';
import * as databaseService from 'app/database';
import * as schemaService from 'app/schema';
import * as tableService from 'app/table';
import { Table } from 'graphql/generated';

export const loaders: MercuriusLoaders = {
  DataSource: {
    async databases(dataSources, ctx) {
      return await Promise.all(
        dataSources.map(async ({ obj }) => {
          const knex = connectionService.getConnection(ctx, obj.url);
          return await databaseService.getDatabases(knex, obj.url);
        }),
      );
    },
  },
  Database: {
    async schemas(databases, ctx) {
      return await Promise.all(
        databases.map(async ({ obj }) => {
          const knex = connectionService.getConnection(ctx, obj.url);
          return await schemaService.getSchemas(knex, obj.url);
        }),
      );
    },
  },
  Schema: {
    async tables(schemas, ctx) {
      if (schemas.length === 0) return [];

      const urls = schemas.map(({ obj }) => obj.url);
      const uniqueUrls = [...new Set(urls)];

      const groupedTables: Record<string, Table[]> = {};

      await Promise.all(
        uniqueUrls.map(async (url) => {
          const schemaNames = schemas
            .filter(({ obj }) => obj.url === url)
            .map(({ obj }) => obj.name);

          const knex = connectionService.getConnection(ctx, url);
          const tables = await tableService.getTables(knex, schemaNames, url);
          groupedTables[url] = tables;
        }),
      );

      return schemas.map(({ obj }) => groupedTables[obj.url]);
    },
  },
};

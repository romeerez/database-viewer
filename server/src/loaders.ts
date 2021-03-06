import { MercuriusLoaders } from 'mercurius';
import * as dataLoader from 'data-loader';

export const loaders: MercuriusLoaders = {
  Server: {
    async databases(servers, ctx) {
      return await dataLoader.getDatabases(
        ctx.getDB,
        servers.map(({ obj }) => obj.url),
      );
    },
  },
  Database: {
    async schemas(databases, ctx) {
      return await dataLoader.getSchemas(
        ctx.getDB,
        databases.map(({ obj }) => obj.url),
      );
    },
  },
  Schema: {
    async tables(schemas, ctx) {
      return await dataLoader.getTables(
        ctx.getDB,
        schemas.map(({ obj }) => obj),
      );
    },
    async views(schemas, ctx) {
      return await dataLoader.getViews(
        ctx.getDB,
        schemas.map(({ obj }) => obj),
      );
    },
    async procedures(schemas, ctx) {
      return await dataLoader.getProcedures(
        ctx.getDB,
        schemas.map(({ obj }) => obj),
      );
    },
  },
  Table: {
    async columns(tables, ctx) {
      return await dataLoader.getColumns(
        ctx.getDB,
        tables.map(({ obj }) => obj),
      );
    },
    async indices(tables, ctx) {
      return await dataLoader.getIndices(
        ctx.getDB,
        tables.map(({ obj }) => obj),
      );
    },
    async foreignKeys(tables, ctx) {
      return await dataLoader.getForeignKeys(
        ctx.getDB,
        tables.map(({ obj }) => obj),
      );
    },
    async constraints(tables, ctx) {
      return await dataLoader.getConstraints(
        ctx.getDB,
        tables.map(({ obj }) => obj),
      );
    },
    async triggers(tables, ctx) {
      return await dataLoader.getTriggers(
        ctx.getDB,
        tables.map(({ obj }) => obj),
      );
    },
  },
  View: {
    async columns(views, ctx) {
      return await dataLoader.getColumns(
        ctx.getDB,
        views.map(({ obj }) => obj),
      );
    },
  },
};

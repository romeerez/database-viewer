import { MercuriusLoaders } from 'mercurius';
import { dataSourcesLoaders } from 'app/dataSources/dataSources.loaders';
import { databasesLoaders } from 'app/databases/databases.loaders';
import { schemasLoaders } from 'app/schemas/schemas.loaders';
import { tablesLoaders } from 'app/tables/tables.loaders';

export const loaders: MercuriusLoaders = {
  DataSource: dataSourcesLoaders,
  Database: databasesLoaders,
  Schema: schemasLoaders,
  Table: tablesLoaders,
};

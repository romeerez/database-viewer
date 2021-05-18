export default {
  root: '/',
  dataSource: (sourceName = ':sourceName') => `/data/${sourceName}`,
  database: (sourceName = ':sourceName', databaseName = ':databaseName') =>
    `/data/${sourceName}/${databaseName}`,
  schema: (
    sourceName = ':sourceName',
    databaseName = ':databaseName',
    schemaName = ':schemaName',
  ) => `/data/${sourceName}/${databaseName}/${schemaName}`,
  table: (
    sourceName = ':sourceName',
    databaseName = ':databaseName',
    schemaName = ':schemaName',
    tableName = ':tableName',
  ) => `/data/${sourceName}/${databaseName}/${schemaName}/${tableName}`,
  newQuery: `/queries/new`,
};

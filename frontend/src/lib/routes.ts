export default {
  root: '/',
  dataSource: (sourceName = ':sourceName') => `/${sourceName}`,
  database: (sourceName = ':sourceName', databaseName = ':databaseName') =>
    `/${sourceName}/${databaseName}`,
  schema: (
    sourceName = ':sourceName',
    databaseName = ':databaseName',
    schemaName = ':schemaName',
  ) => `/${sourceName}/${databaseName}/${schemaName}`,
  table: (
    sourceName = ':sourceName',
    databaseName = ':databaseName',
    schemaName = ':schemaName',
    tableName = ':tableName',
  ) => `/${sourceName}/${databaseName}/${schemaName}/${tableName}`,
};

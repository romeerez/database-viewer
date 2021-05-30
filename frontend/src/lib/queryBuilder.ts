export const buildQuery = ({
  schemaName,
  tableName,
  where,
  orderBy,
  limit,
  offset,
  count = false,
}: {
  schemaName: string;
  tableName: string;
  where?: string;
  orderBy?: string;
  limit?: number;
  offset?: number;
  count?: boolean;
}) => {
  let sql = count ? 'SELECT count(*) FROM ' : 'SELECT * FROM ';

  sql += schemaName === 'public' ? tableName : `${schemaName}.${tableName}`;

  if (where) sql += ` WHERE ${where}`;
  if (orderBy) sql += ` ORDER BY ${orderBy}`;

  if (!count) {
    if (limit) sql += ` LIMIT ${limit}`;
    if (offset) sql += ` OFFSET ${offset}`;
  }

  return sql;
};
